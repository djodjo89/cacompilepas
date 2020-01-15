<?php

namespace App\Module\ConnectionModule\Model;

use App\Connection\Connection;
use App\Model\AbstractModel;
use Firebase\JWT\JWT;

class ConnectionModel extends AbstractModel
{

    public function checkIfUserExists(string $email, string $password): array
    {
        $this->send_query('
                        SELECT id_user, password FROM ccp_user
                        WHERE email = ?
                        ',
            [$email]);
        if ($result = $this->getQuery()->fetch()) {
            if ($password === $result['password'] || password_verify($password, $result['password'])) {
                return $result;
            }
        } else {
            return [];
        }
    }

    public function getUserByEmail(string $email): array
    {
        $this->send_query('
            SELECT id_user FROM ccp_user
            WHERE email = ?
        ', [$email]);

        if ($result = $this->getQuery()->fetch()) {
            return $result;
        } else {
            return [];
        }
    }

    public function checkToken(string $token): bool
    {
        $this->send_query('SELECT token FROM ccp_token
                        WHERE token = ?
                        ',
            [$token]);
        if ($tokenExists = $this->getQuery()->fetch()) {
            // Update token last update date if it is valid
            $this->send_query('UPDATE ccp_token
                            SET last_update_date = NOW()
                            WHERE token = ?
                            ',
                [$token]);
            return true;
        } else {
            return false;
        }
    }

    public function generateToken(string $email, string $password, int $id_user): string
    {
        $this->send_query('SELECT token FROM ccp_token
                        WHERE id_user = ?
                        ',
            [$id_user]);
        $userAlreadyHasAToken = $this->getQuery()->fetch();
        if ($userAlreadyHasAToken) {
            return $userAlreadyHasAToken['token'];
        } else {
            $privateKey = file_get_contents(__DIR__ . '/../../../../keys/private_key.pem');

            $payload = array(
                'email' => $email,
                'password' => $this->checkIfUserExists($email, $password)['password'],
                'time' => new \DateTime('NOW')
            );

            $jwt = JWT::encode($payload, $privateKey, 'RS512');

            $this->send_query('INSERT INTO ccp_token
                            (token, creation_date, last_update_date, id_user)
                            VALUES
                            (?, NOW(), NOW(), ?)
                            ',
                [$jwt, $id_user]);
        }

        return $jwt;
    }

    public function getIcon(int $idUser, string $path, string $uploadDirectory): string
    {
        return $this->getOnFTP($idUser, $path, $uploadDirectory);
    }

    public function getPersonalInformation(string $email): array
    {
        $this->send_query('
            SELECT id_user, first_name, icon
            FROM ccp_user
            WHERE email LIKE ?
        ',
            [$email]);

        return $this->fetchData([
            'status' => 'success',
            'message' => 'User does not exist',
        ]);
    }

    public function getPersonalLobbies(string $email): array
    {
        $this->send_query('
            SELECT id_lobby, label_lobby, description, logo
            FROM ccp_lobby 
            NATURAL JOIN ccp_is_admin cia
            INNER JOIN ccp_user cu ON cia.id_user = cu.id_user
            WHERE email = ?
        ',
            [$email]);
        return $this->fetchData([
            'status' => 'success',
            'message' => 'User does not own any lobby',
        ]);
    }

    public function disconnect(string $email): array
    {
        $successfulDelete = $this->send_query('
            DELETE FROM ccp_token
            WHERE id_user = ?
        ',
            [(int)$this->getUserByEmail($email)['id_user']]);

        if ($successfulDelete) {
            return [
                'status' => 'success',
                'message' => 'Session was successfully closed',
            ];
        } else {
            return [
                'status' => 'fail',
                'message' => 'Session could not be closed',
            ];
        }
    }

    public function register(
        string $pseudo,
        string $firstName,
        string $lastName,
        string $logoName,
        string $logoTmpName,
        string $password,
        string $confirmPassword,
        string $email
    ): array
    {
        if ($password === $confirmPassword) {

            $this->send_query('
                SELECT *
                FROM ccp_user
                WHERE email = ?
            ',
                [$email]);

            if (!$this->getQuery()->fetch()) {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

                $successfulInsert = $this->send_query('
                    INSERT INTO ccp_user
                    (pseudo, first_name, last_name, icon, password, email)
                    VALUES
                    (?, ?, ?, ?, ?, ?)
                ',
                    [$pseudo, $firstName, $lastName, $logoName, $hashedPassword, $email]);

                if ($successfulInsert) {
                    $this->send_query('
                        SELECT id_user
                        FROM ccp_user
                        ORDER BY id_user DESC 
                        LIMIT 1
                    ',
                        []);

                    $idUser = (int)$this->fetchData([])[0]['id_user'];

                    $successfulUpload = $this->uploadOnFTP($idUser, $logoName, $logoTmpName, '/icon/', ['jpg', 'jpeg', 'ico', 'png', 'svg', 'bmp']);

                    if ($successfulUpload) {
                        return [
                            'status' => 'success',
                            'message' => 'User was successfully registered',
                            'id_user' => $idUser,
                            'logoPath' => $logoName,
                        ];
                    } else {
                        return [
                            'status' => 'fail',
                            'message' => 'User icon could not be uploaded',
                            'id_user' => $idUser,
                        ];
                    }
                } else {
                    return [
                        'status' => 'fail',
                        'message' => 'User could not be registered',
                    ];
                }
            } else {
                return [
                    'status' => 'fail',
                    'message' => 'User already exists',
                ];
            }
        } else {
            return [
                'status' => 'fail',
                'message' => 'Passwords do not match',
            ];
        }
    }
}
