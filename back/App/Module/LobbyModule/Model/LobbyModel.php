<?php


namespace App\Module\LobbyModule\Model;

use App\Connection\Connection;
use App\Exception\JSONException;
use App\Model\AbstractModel;
use App\Module\ConnectionModule\Model\ConnectionModel;
use Firebase\JWT\JWT;
use phpDocumentor\Reflection\Types\Boolean;


class LobbyModel extends AbstractModel
{

    public function checkRights(int $idLobby, string $token): string
    {
        $publicKey = file_get_contents(__DIR__ . '/../../../../keys/public_key.pem');
        $decoded = (array)JWT::decode($token, $publicKey, array('RS512'));

        if ($result = (new ConnectionModel($this->getConnection()))->checkIfUserExists($decoded['email'], $decoded['password'])) {
            $idUser = $result['id_user'];
            $this->send_query('
                SELECT id_user
                FROM ccp_is_admin
                WHERE id_user = ?
                AND id_lobby = ?
            ',
                [(int)$idUser, $idLobby]);

            if ($result = $this->getQuery()->fetch()) {
                return 'admin';
            } else {
                $this->send_query('
                    SELECT read_right
                    FROM ccp_rights
                    WHERE id_user = ?
                    AND id_lobby_protect = ?
                ',
                    [(int)$idUser, $idLobby]);
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
        $this->send_query('SELECT label_lobby, description
                        FROM ccp_lobby
                        WHERE id_lobby = ?
                        ',
            [$idLobby]);
        return $this->fetchData(['message' => 'Lobby ' . $idLobby . ' doesn\'t exist']);
    }

    public function getCourseSheets(int $idLobby): array
    {
        $this->send_query('
            SELECT ccp_coursesheet.id_course_sheet, title, publication_date, file_name, description
            FROM ccp_coursesheet
            WHERE id_lobby_Contain = ?
        ',
            [$idLobby]);
        return $this->fetchData(['message' => 'Lobby ' . $idLobby . ' doesn\'t contain any course sheet']);
    }

    public function getMessages(int $idLobby): array
    {
        $this->send_query('SELECT content, send_date, pseudo
                        FROM ccp_message
                        INNER JOIN ccp_user
                        USING(id_user)
                        WHERE id_lobby = ?
                        ',
            [$idLobby]);
        return $this->fetchData(['message' => 'Lobby ' . $idLobby . ' doesn\'t contain any message']);
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

    public function newLobby(string $labelLobby , string $description , Boolean $privateOrNot): string
    {
       $result =  $this->send_query('INSERT INTO ccp_lobby VALUES (?,?,?,?)', [$labelLobby,$description,'testEnAttendantDeRajouterLesUploads',$privateOrNot]);
       if ($result){
           return 'lobby Creer avec succés ! ';
       }
       else{
           return 'echec creation lobby';
       }
    }


    public function updateLogo(int $idLobby, string $fileName, string $tmpName): array
    {
        $oldLogo = $this->backUpAndUpdateLogo($idLobby, $fileName);
        return $this->updateOnFTP($idLobby, $fileName, $tmpName, AbstractModel::$IMG_EXTENSIONS, '/img/', $oldLogo);
    }

    public function updateLobby(int $idLobby, array $newData): array
    {
        return $this->update($idLobby, 'Lobby', 'ccp_lobby', 'id_lobby', $newData);
    }

    public function verifyIfRightExists(int $idLobby, int $idUser): bool
    {
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
                return ['message' => "Read right was successfully added for $email"];
            } else {
                return ['message' => "Read right could not be added for $email"];
            }
        } else {
            return ['message' => "$email already has access to the lobby"];
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
                return ['message' => 'Read right was successfully removed '];
            } else {
                return ['message' => 'Read right could not be removed'];
            }
        } else {
            return ['message' => 'User is already out of the lobby'];
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
                return ['message' => 'Write right was successfully added'];
            } else {
                return ['message' => 'Write right could not be added'];
            }
        } else {
            return ['message' => 'User doesn\'t have access to the lobby'];
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
                return ['message' => 'Write right was successfully removed'];
            } else {
                return ['message' => 'Write right could not be removed from'];
            }
        } else {
            return ['message' => 'User doesn\'t have access to the lobby'];
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
            return ['message' => 'Lobby was successfully made private'];
        } else {
            return ['message' => 'Lobby could not be made private'];
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
            return ['message' => 'Lobby was successfully made public'];
        } else {
            return ['message' => 'Lobby could not be made public'];
        }
    }

    public function getUsers(int $idLobby): array
    {
        $this->send_query('
            SELECT id_user, pseudo, icon, write_right
            FROM ccp_user
            INNER JOIN ccp_rights
            USING (id_user)
            INNER JOIN ccp_is_admin
            USING (id_user)
            WHERE id_lobby_protect = ?
            AND read_right = 1
            AND id_lobby <> ?
        ',
            [$idLobby, $idLobby]);

        return $this->fetchData(['message' => 'Lobby ' . $idLobby . ' does not contain any user']);
    }

    public function getVisibility(int $idLobby): array
    {
        $this->send_query('
            SELECT private
            FROM ccp_lobby
            WHERE id_lobby = ?
        ',
            [$idLobby]);

        return $this->fetchData(['message' => 'Lobby ' . $idLobby . 'does not exist']);
    }
  
    public function getByHashtags(array $hashtags): array
    {
        $this->send_query("
            SELECT id_lobby, label_lobby, ccp_lobby.description, logo FROM 
            ccp_lobby INNER JOIN ccp_coursesheet cc on ccp_lobby.id_lobby = cc.id_lobby_Contain
            INNER JOIN ccp_hashtag ch on cc.id_course_sheet = ch.id_course_sheet
            WHERE label_hashtag IN (?)
        ",
            [$this->arrayToIN($hashtags)]);
        return $this->fetchData([]);
    }
      
    public function getFile(int $idLobby, string $path, string $uploadDirectory) {
        return $this->getOnFTP($idLobby, $path, $uploadDirectory);
    }
}
