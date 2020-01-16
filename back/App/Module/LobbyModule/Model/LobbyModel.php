<?php


namespace App\Module\LobbyModule\Model;

use App\Model\AbstractModel;
use App\Module\ConnectionModule\Model\MessageModel;


class LobbyModel extends AbstractModel
{

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
                $hashtagsParams .= ' AND';
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

        return $this->fetchData();
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
}
