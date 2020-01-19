<?php


namespace App\Module\LobbyModule\Model;

use App\Exception\IncorrectFileExtension;
use App\Http\JSONException;
use App\Model\AbstractFileModel;
use App\Model\AbstractModel;
use App\Module\LobbyModule\Exception\InexistentLobbyException;


class LobbyModel extends AbstractFileModel
{

    public function getLobbyById(int $lobbyId): array
    {
        $this->sendQuery('
            SELECT id_lobby, label_lobby, description, logo
            FROM ccp_lobby
            WHERE id_lobby = ?
        ',
            [$lobbyId]);
        return $this->fetchData('Lobby does not exist');
    }

    public function getLogo(int $lobbyId): string
    {
        $this->sendQuery('
            SELECT logo 
            FROM ccp_lobby
            WHERE id_lobby = ?
        ',
            [$lobbyId]);

        if ($result = $this->getQuery()->fetch()) {
            return $result['logo'];
        } else {
            return '';
        }
    }

    public function backUpAndUpdateLogo(int $lobbyId, string $fileName): string
    {
        // Update logo in database
        // But make a backup of old logo before to be able to update logo on ftp server
        $oldLogo = $this->getLogo($lobbyId);
        $this->updateLobby($lobbyId, ['logo' => $fileName]);
        return $oldLogo;
    }

    public function updateLogo(int $lobbyId, string $fileName, string $tmpName): array
    {
        $oldLogo = $this->backUpAndUpdateLogo($lobbyId, $fileName);
        try {
            $result = $this->updateOnFTP($lobbyId, $fileName, $tmpName, AbstractModel::$IMG_EXTENSIONS, '/logo/', $oldLogo);
            return $result;
        } catch (IncorrectFileExtension $e) {
            throw new JSONException($e->getMessage());
        }
    }

    public function updateLobby(int $lobbyId, array $newData): array
    {
        return $this->update($lobbyId, 'Lobby', 'ccp_lobby', 'id_lobby', $newData);
    }

    public function makePrivate(int $lobbyId): array
    {
        $this->sendQuery('
            SELECT private
            FROM ccp_lobby
            WHERE id_lobby = ?
            AND private = 0
        ',
            [$lobbyId]);

        if ($result = $this->getQuery()->fetch()) {
            $successfullyMadePrivate = $this->sendQuery('
            UPDATE ccp_lobby
            SET private = 1
            WHERE id_lobby = ?
        ',
                [$lobbyId]);

            if ($successfullyMadePrivate) {
                return [
                    'message' => 'Lobby was successfully made private',
                ];
            } else {
                throw new JSONException('Lobby could not be made private');
            }
        } else {
            throw new JSONException('Lobby is already private');
        }
    }

    public function makePublic(int $lobbyId): array
    {
        $this->sendQuery('
            SELECT private
            FROM ccp_lobby
            WHERE id_lobby = ?
            AND private = 1
        ',
            [$lobbyId]);

        if ($result = $this->getQuery()->fetch()) {
            $successfullyMadePublic = $this->sendQuery('
            UPDATE ccp_lobby
            SET private = 0
            WHERE id_lobby = ?
        ',
                [$lobbyId]);

            if ($successfullyMadePublic) {
                return [
                    'message' => 'Lobby was successfully made public',
                ];
            } else {
                throw new JSONException('Lobby could not be made public');
            }
        } else {
            throw new JSONException('Lobby is already public');
        }
    }

    public function getVisibility(int $lobbyId): array
    {
        $this->sendQuery('
            SELECT private
            FROM ccp_lobby
            WHERE id_lobby = ?
        ',
            [$lobbyId]);

        return $this->fetchData('Lobby does not exist');
    }

    public function getLobbies(): array
    {
        $this->sendQuery('
            SELECT id_lobby, label_lobby, description, logo, pseudo
            FROM ccp_lobby
            LEFT OUTER JOIN ccp_is_admin USING(id_lobby)
            LEFT OUTER JOIN ccp_user USING(id_user)
            WHERE private = 0
        ');
        return $this->fetchData('There is no public lobby');
    }

    public function getPath(int $lobbyId): string
    {
        $this->sendQuery('
            SELECT logo 
            FROM ccp_lobby
            WHERE id_lobby = ?
        ',
            [$lobbyId]);

        if ($path = $this->getQuery()->fetch()) {
            return $path['logo'];
        } else {
            throw new InexistentLobbyException();
        }
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

        $this->sendQuery('
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

    public function delete(int $lobbyId): array
    {
        $successfullDelete = $this->sendQuery('
            DELETE 
            FROM ccp_lobby
            WHERE id_lobby = ?
        ',
            [$lobbyId]);

        if ($successfullDelete) {
            return [
                'message' => 'Lobby was successfully deleted',
            ];
        } else {
            throw new JSONException('Lobby could not be deleted');
        }
    }

    public function create(
        string $idAdmin,
        string $label,
        string $description,
        string $private,
        string $logoName = '',
        string $logoTmpName = ''
    ): array
    {
        $successfulInsert = $this->sendQuery('
            INSERT INTO ccp_lobby
            (label_lobby, description, logo, private)
            VALUES
            (?, ?, ?, ?)
        ',
            [$label, $description, $logoName, 'true' === $private ? 1 : 0]);

        if ($successfulInsert) {
            $this->sendQuery('
                SELECT id_lobby
                FROM ccp_lobby
                ORDER BY id_lobby DESC 
                LIMIT 1
            ',
                []);

            $lobbyId = (int)$this->fetchData('Lobby does not exist')['data'][0]['id_lobby'];

            if ('' !== $logoName && '' !== $logoTmpName) {

                try {
                    $successfulUpload = $this->uploadOnFTP($lobbyId, $logoName, $logoTmpName, '/logo/', ['jpg', 'jpeg', 'ico', 'png', 'svg', 'bmp']);
                } catch (IncorrectFileExtension $e) {
                    throw new JSONException($e->getMessage());
                } catch (JSONException $e) {
                    throw $e;
                }

                if ($successfulUpload) {
                    $this->sendQuery('
                        SELECT id_lobby
                        FROM ccp_lobby
                        ORDER BY id_lobby DESC 
                        LIMIT 1
                    ');

                    return [
                        'id_lobby' => $this->getQuery()->fetch()['id_lobby'],
                        'message' => 'Lobby was successfully created',
                    ];
                } else {
                    throw new JSONException('Lobby logo could not be uploaded');
                }
            }

            $this->sendQuery('
                INSERT INTO ccp_is_admin
                (id_user, id_lobby) VALUES (?, ?)
            ',
                [$idAdmin, $lobbyId]);

            return [
                'id_lobby' => $lobbyId,
                'message' => 'Lobby was successfully uploaded',
            ];
        } else {
            throw new JSONException('Lobby could not be created');
        }
    }

    public function defaultFileExtension(): string
    {
        return 'png';
    }
}
