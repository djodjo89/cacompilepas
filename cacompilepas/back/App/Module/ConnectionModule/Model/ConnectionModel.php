<?php

namespace App\Module\ConnectionModule\Model;

use App\Http\JSONException;
use App\Model\AbstractModel;
use App\Module\UserModule\Model\UserModel;
use Firebase\JWT\JWT;

class ConnectionModel extends AbstractModel
{

    public function makeTokenIfUserExists(string $email, string $password): array
    {
        $user = (new UserModel($this->getConnection()))->checkIfUserExists($email, $password);
        if (0 !== count($user)) {
            $userId = $user['id_user'];
            return [
                'token' => $this->generateToken($email, $password, $userId),
            ];
        } else {
            throw new JSONException('User does not exist');
        }
    }

    public function checkToken(string $token): bool
    {
        $this->sendQuery('
            SELECT 
            token FROM ccp_token
            WHERE token = ?
        ',
            [$token]);

        if ($tokenExists = $this->getQuery()->fetch()) {
            // Update token last update date if it is valid
            $successfulUpdate = $this->sendQuery('UPDATE ccp_token
                            SET last_update_date = NOW()
                            WHERE token = ?
                            ',
                [$token]);

            return $successfulUpdate;
        } else {
            return false;
        }
    }

    public function generateToken(string $email, string $password, int $id_user): string
    {
        $this->sendQuery('
            SELECT token 
            FROM ccp_token
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
                'password' => (new UserModel($this->getConnection()))->checkIfUserExists($email, $password)['password'],
                'time' => new \DateTime('NOW')
            );

            $jwt = JWT::encode($payload, $privateKey, 'RS512');

            $successfuleInsert = $this->sendQuery('INSERT INTO ccp_token
                            (token, creation_date, last_update_date, id_user)
                            VALUES
                            (?, NOW(), NOW(), ?)
                            ',
                [$jwt, $id_user]);

            if (!$successfuleInsert) {
                throw new JSONException('An error occurred during token generation');
            }
        }

        return $jwt;
    }

    public function disconnect(string $email): array
    {
        $successfulDelete = $this->sendQuery('
            DELETE 
            FROM ccp_token
            WHERE id_user = ?
        ',
            [(int)(new UserModel($this->getConnection()))->getUserByEmail($email)['id_user']]);

        if ($successfulDelete) {
            return [
                'message' => 'Session was successfully closed',
            ];
        } else {
            throw new JSONException('Session could not be closed');
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

            $this->sendQuery('
                SELECT *
                FROM ccp_user
                WHERE email = ?
            ',
                [$email]);

            if (!$this->getQuery()->fetch()) {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

                $successfulInsert = $this->sendQuery('
                    INSERT INTO ccp_user
                    (pseudo, first_name, last_name, icon, password, email)
                    VALUES
                    (?, ?, ?, ?, ?, ?)
                ',
                    [$pseudo, $firstName, $lastName, $logoName, $hashedPassword, $email]);

                if ($successfulInsert) {
                    $this->sendQuery('
                        SELECT id_user
                        FROM ccp_user
                        ORDER BY id_user DESC 
                        LIMIT 1
                    ',
                        []);

                    $userId = (int)$this->fetchData('User does not exist')['data'][0]['id_user'];

                    $successfulUpload = (new UserModel($this->getConnection()))->uploadOnFTP($userId, $logoName, $logoTmpName, '/icon/', ['jpg', 'jpeg', 'ico', 'png', 'svg', 'bmp']);

                    if ($successfulUpload) {
                        return [
                            'message' => 'User was successfully registered',
                        ];
                    } else {
                        throw new JSONException('User icon could not be uploaded');
                    }
                } else {
                    throw new JSONException('User could not be registered');
                }
            } else {
                throw new JSONException('User already exists');
            }
        } else {
            throw new JSONException('Passwords do not match');
        }
    }
}
