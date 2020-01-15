<?php


namespace App\Module\LobbyModule\Model;

use App\Connection\Connection;
use App\Exception\JSONException;
use App\Model\AbstractModel;
use App\Module\ConnectionModule\Model\ConnectionModel;
use App\Module\ConnectionModule\Model\MessageModel;
use Firebase\JWT\JWT;


class LobbyModel extends AbstractModel
{
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
    public function checkRights(int $idLobby, string $token): string
    {
        $decoded = $this->getUserFromToken($token);

        if ($result = (new ConnectionModel($this->getConnection()))->checkIfUserExists($decoded['email'], $decoded['password'])) {
            $isAdmin = $this->isAdmin((int)$result['id_user'], $idLobby);

            if ($isAdmin) {
                return 'admin';
            } else {
                $this->send_query('
                    SELECT read_right, id_lobby
                    FROM ccp_rights
                    RIGHT OUTER JOIN ccp_lobby cl ON ccp_rights.id_lobby_Protect = cl.id_lobby
                    WHERE 
                    private = 0 OR
                    id_user = ?
                    AND id_lobby_protect = ?
                ',
                    [(int)$result['id_user'], $idLobby]);
                if ($result = $this->getQuery()->fetch()) {
                    return 'user';
                } else {
                    return 'none';
                }
            }
        } else {
            return 'none';
        }
    }

    public function getLobbyById(int $idLobby): array
    {
        $this->send_query('SELECT id_lobby, label_lobby, description, logo
                        FROM ccp_lobby
                        WHERE id_lobby = ?
                        ',
            [$idLobby]);
        return $this->fetchData([
            'status' => 'fail',
            'message' => 'Lobby ' . $idLobby . ' doesn\'t exist',
        ]);
    }

    public function getCourseSheets(int $idLobby): array
    {
        $this->send_query('
            SELECT ccp_coursesheet.id_course_sheet, title, publication_date, file_name, ccp_coursesheet.description, pseudo
            FROM ccp_coursesheet 
            INNER JOIN ccp_lobby cl ON ccp_coursesheet.id_lobby_contain = cl.id_lobby
            INNER JOIN ccp_is_admin cia on cl.id_lobby = cia.id_lobby
            INNER JOIN ccp_user cu on cia.id_user = cu.id_user
            WHERE id_lobby_Contain = ?
        ',
            [$idLobby]);
        return $this->fetchData([
            'status' => 'fail',
            'message' => 'Lobby ' . $idLobby . ' doesn\'t contain any course sheet',
        ]);
    }

    public function getMessages(int $idLobby): array
    {
        $this->send_query('SELECT id_message, content, send_date, id_user, pseudo, icon
                        FROM ccp_message
                        INNER JOIN ccp_user
                        USING(id_user)
                        WHERE id_lobby = ?
                        ',
            [$idLobby]);
        return $this->fetchData([
            'status' => 'fail',
            'message' => 'Lobby ' . $idLobby . ' doesn\'t contain any message',
        ]);
    }

    public function getLogo(int $idLobby): string
    {
        $this->send_query(
            'SELECT logo FROM ccp_lobby
                        WHERE id_lobby = ?
                        ',
            [$idLobby]);

        if ($result = $this->getQuery()->fetch()) {
            return $result['logo'];
        } else {
            return '';
        }
    }

    public function backUpAndUpdateLogo(int $idLobby, string $fileName): string
    {
        // Update logo in database
        // But make a backup of old logo before to be able to update logo on ftp server
        $oldLogo = $this->getLogo($idLobby);
        $this->updateLobby($idLobby, ['logo' => $fileName]);
        return $oldLogo;
    }

    public function updateLogo(int $idLobby, string $fileName, string $tmpName): array
    {
        $oldLogo = $this->backUpAndUpdateLogo($idLobby, $fileName);
        return $this->updateOnFTP($idLobby, $fileName, $tmpName, AbstractModel::$IMG_EXTENSIONS, '/logo/', $oldLogo);
    }

    public function updateLobby(int $idLobby, array $newData): array
    {
        return $this->update($idLobby, 'Lobby', 'ccp_lobby', 'id_lobby', $newData);
    }

    public function verifyIfRightExists(int $idLobby, int $idUser): bool
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

    public function findUser(string $email): int
    {
        $user = (new ConnectionModel($this->getConnection()))->getUserByEmail($email);
        if ($user) {
            return $user['id_user'];
        } else {
            new JSONException("No user was found with address $email");
        }
    }

    public function addUser(int $idLobby, string $email): array
    {
        $idUser = $this->findUser($email);

        if (!$this->verifyIfRightExists($idLobby, $idUser)) {
            $successfulRightCreation = $this->send_query('
                INSERT INTO ccp_rights
                (read_right, write_right, id_lobby_protect, id_user)
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
        if ($this->verifyIfRightExists($idLobby, $idUser)) {
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

    public function addWriteRight(int $idLobby, int $idUser): array
    {
        if ($this->verifyIfRightExists($idLobby, $idUser)) {
            $successfulWriteRightUpdate = $this->send_query('
                UPDATE ccp_rights
                SET write_right = 1
                WHERE id_lobby_protect = ?
                AND id_user = ?
            ',
                [$idLobby, $idUser]);

            if ($successfulWriteRightUpdate) {
                return [
                    'status' => 'success',
                    'message' => 'Write right was successfully added',
                ];
            } else {
                return [
                    'status' => 'fail',
                    'message' => 'Write right could not be added',
                ];
            }
        } else {
            return [
                'status' => 'fail',
                'message' => 'User doesn\'t have access to the lobby',
            ];
        }
    }

    public function removeWriteRight(int $idLobby, int $idUser): array
    {
        if ($this->verifyIfRightExists($idLobby, $idUser)) {
            $successfulWriteRightRemove = $this->send_query('
                UPDATE ccp_rights
                SET write_right = 0
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

    public function makePrivate(int $idLobby): array
    {
        $successfullyMadePublic = $this->send_query('
            UPDATE ccp_lobby
            SET private = 1
            WHERE id_lobby = ?
        ',
            [$idLobby]);

        if ($successfullyMadePublic) {
            return [
                'status' => 'success',
                'message' => 'Lobby was successfully made private',
            ];
        } else {
            return [
                'status' => 'fail',
                'message' => 'Lobby could not be made private',
            ];
        }
    }

    public function makePublic(int $idLobby): array
    {
        $successfullyMadePublic = $this->send_query('
            UPDATE ccp_lobby
            SET private = 0
            WHERE id_lobby = ?
        ',
            [$idLobby]);

        if ($successfullyMadePublic) {
            return [
                'status' => 'success',
                'message' => 'Lobby was successfully made public',
            ];
        } else {
            return [
                'status' => 'fail',
                'message' => 'Lobby could not be made public',
            ];
        }
    }

    public function getUsers(int $idLobby): array
    {
        $this->send_query('
            SELECT DISTINCT cu.id_user, pseudo, icon, write_right
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

    public function getVisibility(int $idLobby): array
    {
        $this->send_query('
            SELECT private
            FROM ccp_lobby
            WHERE id_lobby = ?
        ',
            [$idLobby]);

        return $this->fetchData([
            'status' => 'fail',
            'message' => 'Lobby ' . $idLobby . 'does not exist',
        ]);
    }
  
    public function getByHashtags(array $hashtags): array
    {
        $this->send_query('
            SELECT id_lobby, label_lobby, ccp_lobby.description, logo FROM 
            ccp_lobby INNER JOIN ccp_coursesheet cc ON ccp_lobby.id_lobby = cc.id_lobby_contain
            INNER JOIN ccp_hashtag ch ON cc.id_course_sheet = ch.id_course_sheet
            WHERE label_hashtag IN (?)
        ',
            [$this->arrayToIN($hashtags)]);
        return $this->fetchData([]);
    }
      
    public function getFile(int $idLobby, string $path, string $uploadDirectory): string
    {
        return $this->getOnFTP($idLobby, $path, $uploadDirectory);
    }

    public function getLobbies(): array
    {
        $this->send_query('
            SELECT id_lobby, label_lobby, description, logo, pseudo
            FROM ccp_lobby
            LEFT OUTER JOIN ccp_is_admin USING(id_lobby)
            LEFT OUTER JOIN ccp_user USING(id_user)
            WHERE private = 0
        ');
        return $this->fetchData([
            'status' => 'fail',
            'message' => 'There is no public lobby',
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

        return $this->fetchData([]);
    }
  
    public function searchLobbies(array $search, array $hashtags): array
    {
        $count = 0;
        $lengthSearch = count($search);
        $searchParams = '';
        $hashtagsParams = '';
        $lengthHashtags = count($hashtags);

        foreach ($search as $key => $value) {
            $searchParams .= " UPPER(label_lobby) LIKE UPPER('%" . $value . "%')";
            if ($count !== $lengthSearch - 1) {
                $searchParams .= ' AND';
            }
            $count++;
        }

        $count = 0;

        foreach ($hashtags as $key => $value) {
            $hashtagsParams .= " label_hashtag = '" . $value . "'";
            if ($count !== $lengthHashtags - 1) {
                $hashtagsParams .= ' OR';
            }
            $count++;
        }

        $this->send_query('
            SELECT DISTINCT id_lobby, label_lobby, ccp_lobby.description, logo 
            FROM ccp_lobby 
            LEFT OUTER JOIN ccp_coursesheet ON ccp_lobby.id_lobby = ccp_coursesheet.id_lobby_contain
            LEFT OUTER JOIN ccp_hashtag ON ccp_coursesheet.id_course_sheet = ccp_hashtag.id_course_sheet
            WHERE
            ' . (0 !== $lengthSearch ? '(' . $searchParams . ') ' : '') .
            (0 !== $lengthHashtags ? 0 !== $lengthSearch ? ' AND (' . $hashtagsParams . ')' : '(' . $hashtagsParams . ')' : '') .
            ' AND private = 0
            ',
            []);

        return $this->fetchData([]);
    }

    public function delete(int $idLobby): array
    {
        $successfullDelete = $this->send_query('
            DELETE FROM ccp_lobby
            WHERE id_lobby = ?
        ',
            [$idLobby]);

        if ($successfullDelete) {
            return [
                'status' => 'success',
                'message' => 'Lobby was successfully deleted',
            ];
        } else {
            return [
                'status' => 'fail',
                'message' => 'Lobby could not be deleted',
            ];
        }
    }

    public function create(
        string $idAdmin,
        string $label,
        string $description,
        string $private,
        string $logoName,
        string $logoTmpName
    ): array
    {
        $successfulInsert = $this->send_query('
            INSERT INTO ccp_lobby
            (label_lobby, description, logo, private)
            VALUES
            (?, ?, ?, ?)
        ',
            [$label, $description, $logoName, 'true' === $private ? 1 : 0]);

        if ($successfulInsert) {
            $this->send_query('
                SELECT id_lobby
                FROM ccp_lobby
                ORDER BY id_lobby DESC 
                LIMIT 1
            ',
                []);

            $idLobby = (int)$this->fetchData([])[0]['id_lobby'];

            $successfulUpload = $this->uploadOnFTP($idLobby, $logoName, $logoTmpName, '/logo/', ['jpg', 'jpeg', 'ico', 'png', 'svg', 'bmp']);

            $this->send_query('
                INSERT INTO ccp_is_admin
                (id_user, id_lobby) VALUES (?, ?)
            ',
                [$idAdmin, $idLobby]);

            return [
                'status' => 'success',
                'message' => 'Lobby was successfully uploaded',
                    'id_lobby' => $idLobby,
                    'logoPath' => $logoName,
                ];
        } else {
            return [
                'status' => 'fail',
                'message' => 'Lobby could not be created',
            ];
        }
    }

    public function idUserFromToken(string $token) {
        $decoded = $this->getUserFromToken($token);
        return $this->findUser($decoded['email']);
    }
}
