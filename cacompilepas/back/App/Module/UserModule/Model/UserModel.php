<?php

namespace App\Module\UserModule\Model;

use App\Http\JSONException;
use App\Model\AbstractFileModel;
use App\Module\UserModule\Exception\InexistentUserException;
use Firebase\JWT\JWT;

class UserModel extends AbstractFileModel
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
            throw new InexistentUserException();
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
            throw new InexistentUserException();
        }
    }

    public function isAdmin(int $userId, int $idLobby): bool
    {
        $this->send_query('
                SELECT id_user
                FROM ccp_is_admin
                WHERE id_user = ?
                AND id_lobby = ?
            ',
            [(int)$userId, $idLobby]);
        return $this->getQuery()->fetch() ? true : false;
    }

    public function getPersonalInformation(string $email): array
    {
        $this->send_query('
            SELECT id_user, first_name, pseudo, icon
            FROM ccp_user
            WHERE email LIKE ?
        ',
            [$email]);

        return $this->fetchData('User does not exist');
    }

    public function getPath(int $userId): string
    {
        $this->send_query('
            SELECT icon FROM ccp_user
            WHERE id_user = ?
        ',
            [$userId]);

        if ($path = $this->getQuery()->fetch()) {
            return $path['icon'];
        } else {
            throw new InexistentUserException();
        }
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
        return $this->fetchData('User does not own any lobby');
    }

    public function checkIfRightExists(int $idLobby, int $userId): bool
    {
        $isAdmin = $this->isAdmin($userId, $idLobby);
        if (!$isAdmin) {
            $this->send_query('
            SELECT id_right FROM ccp_rights
            WHERE id_lobby_protect = ?
            AND id_user = ?
        ',
                [$idLobby, $userId]);

            return $this->getQuery()->fetch() ? true : false;
        } else {
            return true;
        }
    }

    public function addUser(int $idLobby, string $email): array
    {
        $userId = $this->findUser($email);

        if (!$this->checkIfRightExists($idLobby, $userId)) {
            $successfulRightCreation = $this->send_query('
                INSERT INTO ccp_rights
                (read_right, write_right, id_lobby_protect, id_user)
                VALUES
                (?, ?, ?, ?)
            ',
                [1, 0, $idLobby, (int)$userId]);

            if ($successfulRightCreation) {
                return [
                    'message' => "Read right was successfully added for $email",
                ];
            } else {
                throw new JSONException("Read right could not be added for $email");
            }
        } else {
            throw new JSONException("$email already has access to the lobby");
        }
    }

    public function removeUser(int $idLobby, int $userId): array
    {
        if ($this->checkIfRightExists($idLobby, $userId)) {
            $successfulRightDeletion = $this->send_query('
                DELETE FROM ccp_rights
                WHERE id_lobby_protect = ?
                AND id_user = ?
            ',
                [$idLobby, $userId]);

            if ($successfulRightDeletion) {
                return [
                    'message' => 'Read right was successfully removed ',
                ];
            } else {
                throw new JSONException('Read right could not be removed');
            }
        } else {
            throw new JSONException('User is already out of the lobby');
        }
    }

    public function addWriteRight(int $idLobby, int $userId): array
    {
        if ($this->checkIfRightExists($idLobby, $userId)) {
            $successfulWriteRightAdd = $this->send_query('
                UPDATE ccp_rights
                SET write_right = 1
                WHERE id_lobby_protect = ?
                AND id_user = ?
            ',
                [$idLobby, $userId]);

            if ($successfulWriteRightAdd) {
                return [
                    'message' => 'Write right was successfully added',
                ];
            } else {
                throw new JSONException('Write right could not be added');
            }
        } else {
            throw new JSONException('User does not have access to the lobby');
        }
    }

    public function removeWriteRight(int $idLobby, int $userId): array
    {
        if ($this->checkIfRightExists($idLobby, $userId)) {
            $successfulWriteRightRemove = $this->send_query('
                UPDATE ccp_rights
                SET write_right = 0
                WHERE id_lobby_protect = ?
                AND id_user = ?
            ',
                [$idLobby, $userId]);

            if ($successfulWriteRightRemove) {
                return [
                    'message' => 'Write right was successfully removed',
                ];
            } else {
                throw new JSONException('Write right could not be removed');
            }
        } else {
            throw new JSONException('User does not have access to the lobby');
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

        return $this->fetchData('Lobby does not contain any user');
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
        if ('' !== $token) {
            $publicKey = file_get_contents(__DIR__ . '/../../../../keys/public_key.pem');
            return (array)JWT::decode($token, $publicKey, array('RS512'));
        } else {
            throw new InexistentUserException();
        }
    }

    public function userIdFromToken(string $token): int
    {
        $decoded = $this->getUserFromToken($token);
        return $this->findUser($decoded['email']);
    }

    public function findUser(string $email): int
    {
        $user = $this->getUserByEmail($email);
        if ($user) {
            return $user['id_user'];
        } else {
            throw new InexistentUserException();
        }
    }
}