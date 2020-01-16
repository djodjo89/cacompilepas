<?php

namespace App\Module\UserModule\Model;

use App\Exception\JSONException;
use App\Model\AbstractModel;
use App\Module\ConnectionModule\Model\ConnectionModel;
use Firebase\JWT\JWT;

class UserModel extends AbstractModel
{
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

    public function isAdmin(int $idUser, int $idLobby): bool
    {
        $this->send_query('
                SELECT id_user
                FROM ccp_is_admin
                WHERE id_user = ?
                AND id_lobby = ?
            ',
            [(int)$idUser, $idLobby]);
        if ($this->getQuery()->fetch()) {
            return true;
        } else {
            return false;
        }
    }

    public function getPersonalInformation(string $email): array
    {
        $this->send_query('
            SELECT id_user, first_name, pseudo, icon
            FROM ccp_user
            WHERE email LIKE ?
        ',
            [$email]);

        return $this->fetchData([
            'status' => 'success',
            'message' => 'User does not exist',
        ]);
    }

    public function getIcon(int $idUser, string $path, string $uploadDirectory): string
    {
        return $this->getOnFTP($idUser, $path, $uploadDirectory);
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

    public function checkIfRightExists(int $idLobby, int $idUser): bool
    {
        $isAdmin = $this->isAdmin($idUser, $idLobby);
        if (!$isAdmin) {
            $this->send_query('
            SELECT id_right FROM ccp_rights
            WHERE id_lobby_protect = ?
            AND id_user = ?
        ',
                [$idLobby, $idUser]);

            if ($result = $this->getQuery()->fetch()) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    public function addUser(int $idLobby, string $email): array
    {
        $idUser = $this->findUser($email);

        if (!$this->checkIfRightExists($idLobby, $idUser)) {
            $successfulRightCreation = $this->send_query('
                INSERT INTO ccp_rights
                (read_right, id_lobby_protect, id_user)
                VALUES
                (?, ?, ?, ?)
            ',
                [1, 0, $idLobby, (int)$idUser]);

            if ($successfulRightCreation) {
                return [
                    'status' => 'success',
                    'message' => "Read right was successfully added for $email",
                ];
            } else {
                return [
                    'status' => 'fail',
                    'message' => "Read right could not be added for $email",
                ];
            }
        } else {
            return [
                'status' => 'fail',
                'message' => "$email already has access to the lobby",
            ];
        }
    }

    public function removeUser(int $idLobby, int $idUser): array
    {
        if ($this->checkIfRightExists($idLobby, $idUser)) {
            $successfulRightDeletion = $this->send_query('
                DELETE FROM ccp_rights
                WHERE id_lobby_protect = ?
                AND id_user = ?
            ',
                [$idLobby, $idUser]);

            if ($successfulRightDeletion) {
                return [
                    'status' => 'success',
                    'message' => 'Read right was successfully removed ',
                ];
            } else {
                return [
                    'status' => 'fail',
                    'message' => 'Read right could not be removed',
                ];
            }
        } else {
            return [
                'status' => 'fail',
                'message' => 'User is already out of the lobby',
            ];
        }
    }

    public function removeWriteRight(int $idLobby, int $idUser): array
    {
        if ($this->checkIfRightExists($idLobby, $idUser)) {
            $successfulWriteRightRemove = $this->send_query('
                UPDATE ccp_rights
                WHERE id_lobby_protect = ?
                AND id_user = ?
            ',
                [$idLobby, $idUser]);

            if ($successfulWriteRightRemove) {
                return [
                    'status' => 'success',
                    'message' => 'Write right was successfully removed',
                ];
            } else {
                return [
                    'status' => 'fail',
                    'message' => 'Write right could not be removed from',
                ];
            }
        } else {
            return [
                'status' => 'fail',
                'message' => 'User doesn\'t have access to the lobby',
            ];
        }
    }

    public function getUsers(int $idLobby): array
    {
        $this->send_query('
            SELECT DISTINCT cu.id_user, pseudo, icon
            FROM ccp_user cu
            INNER JOIN ccp_rights cr ON cu.id_user = cr.id_user
            INNER JOIN ccp_is_admin cia on cr.id_lobby_protect = cia.id_lobby
            WHERE read_right = 1
            AND id_lobby_protect = ?
            AND cr.id_user != cia.id_user
        ',
            [$idLobby]);

        return $this->fetchData([
            'status' => 'fail',
            'message' => 'Lobby ' . $idLobby . ' does not contain any user',
        ]);
    }

    public function searchUsers(array $search): array
    {
        $count = 0;
        $lengthSearch = count($search);
        $usersParams = '';

        foreach ($search as $key => $value) {
            $usersParams .= " UPPER(pseudo) LIKE UPPER('%" . $value . "%') OR 
                              UPPER(first_name) LIKE UPPER('%" . $value . "%') OR 
                              UPPER(last_name) LIKE UPPER('%" . $value . "%')";
            if ($count !== $lengthSearch - 1) {
                $usersParams .= ' OR';
            }
            $count++;
        }

        $this->send_query('
            SELECT DISTINCT id_user, first_name, last_name, pseudo, icon
            FROM ccp_user
            WHERE' . $usersParams,
            []);

        return $this->fetchData();
    }

    public function getUserFromToken(string $token): array
    {
        $publicKey = file_get_contents(__DIR__ . '/../../../../keys/public_key.pem');
        return (array)JWT::decode($token, $publicKey, array('RS512'));
    }

    public function idUserFromToken(string $token) {
        $decoded = $this->getUserFromToken($token);
        return $this->findUser($decoded['email']);
    }

    public function findUser(string $email): int
    {
        $user = $this->getUserByEmail($email);
        if ($user) {
            return $user['id_user'];
        } else {
            new JSONException("No user was found with address $email");
        }
    }
}