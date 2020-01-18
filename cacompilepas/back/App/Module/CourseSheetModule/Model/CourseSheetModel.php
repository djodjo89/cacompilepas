<?php

namespace App\Module\CourseSheetModule\Model;

use App\Exception\IncorrectFileExtension;
use App\Http\JSONException;
use App\Model\AbstractFileModel;
use App\Model\AbstractModel;
use App\Module\CourseSheetModule\Exception\InexistentCourseSheetException;
use App\Module\CourseSheetModule\Exception\InexistentHashtagException;
use App\Module\LobbyModule\Exception\InexistentLobbyException;

class CourseSheetModel extends AbstractFileModel
{

    public function getLobbyId(int $courseSheetId): int
    {
        $this->sendQuery('
            SELECT id_course_sheet
            FROM ccp_coursesheet
            WHERE id_course_sheet = ?
        ',
            [$courseSheetId]);

        if ($result = $this->getQuery()->fetch()) {
            $this->sendQuery('
            SELECT id_lobby_contain
            FROM ccp_coursesheet
            WHERE id_course_sheet = ?
        ',
                [$courseSheetId]);

            $result = $this->fetchData();

            if (0 !== count($result)) {
                return $result['data'][0]['id_lobby_contain'];
            } else {
                throw new InexistentLobbyException();
            }
        } else {
            throw new InexistentCourseSheetException();
        }
    }

    public function getCourseSheets(int $lobbyId): array
    {
        $this->sendQuery('
            SELECT ccp_coursesheet.id_course_sheet, title, publication_date, file_name, ccp_coursesheet.description, pseudo
            FROM ccp_coursesheet 
            INNER JOIN ccp_lobby cl ON ccp_coursesheet.id_lobby_contain = cl.id_lobby
            INNER JOIN ccp_is_admin cia on cl.id_lobby = cia.id_lobby
            INNER JOIN ccp_user cu on cia.id_user = cu.id_user
            WHERE id_lobby_Contain = ?
        ',
            [$lobbyId]);
        return $this->fetchData('Lobby does not contain any course sheet');
    }

    public function addCourseSheet(int $lobbyId, string $title, string $fileName, string $tmpName, string $description, array $hashtags): array
    {
        $successfulInsert = $this->sendQuery('
            INSERT INTO ccp_coursesheet
            (title, publication_date, file_name, description, id_lobby_contain)
            VALUES
            (?, NOW(), ?, ?, ?)
        ',
            [$title, $fileName, $description, $lobbyId]);

        if ($successfulInsert) {

            $this->sendQuery('
            SELECT id_course_sheet
            FROM ccp_coursesheet
            ORDER BY id_course_sheet DESC
            LIMIT 1
        ',
                []);

            $courseSheetId = (int)$this->fetchData('Course sheet does not exist')['data'][0]['id_course_sheet'];

            try {
                $this->uploadOnFTP($courseSheetId, $fileName, $tmpName, '/course_sheets/', AbstractModel::$COURSE_SHEET_EXTENSIONS);
            } catch (IncorrectFileExtension $e) {
                throw new JSONException($e->getMessage());
            } catch (JSONException $e) {
                throw $e;
            }

            foreach ($hashtags as $key => $value) {
                if ($successfulInsert && $successfulUpload) {
                    $successfulInsert = $this->sendQuery('
                INSERT INTO ccp_hashtag
                (label_hashtag, id_course_sheet) 
                VALUES 
                (?, ?)
            ',
                        [$value, $courseSheetId]);
                }
            }

            return [
                'message' => 'Course sheet was successfully added',
            ];
        } else {
            throw new JSONException('Course sheet could not be added');
        }
    }

    public function deleteCourseSheet(int $lobbyId, $courseSheetId): array
    {
        $this->sendQuery('
                SELECT file_name
                FROM ccp_coursesheet
                WHERE id_course_sheet = ?
            ',
            [$courseSheetId]);
        $fileName = $this->getQuery()->fetch()['file_name'];

        $successfulDelete = $this->sendQuery('
            DELETE FROM ccp_coursesheet
            WHERE id_lobby_contain = ?
            AND id_course_sheet = ?
        ',
            [$lobbyId, $courseSheetId]);
        if ($successfulDelete) {
            $this->sendQuery('
                SELECT file_name
                FROM ccp_coursesheet
                WHERE id_course_sheet = ?
            ',
                [$courseSheetId]);

            $oldFileNameOnFTPServer = '/course_sheets/' . $this->nameOnFTP($courseSheetId, $fileName, $this->extension($fileName));
            $this->deleteOnFTP($oldFileNameOnFTPServer, '/course_sheets/');

            return [
                'message' => 'Course sheet was successfully deleted',
            ];
        } else {
            throw new JSONException('Course sheet could not be deleted');
        }
    }

    public function addHashtags(int $courseSheetId, array $hashtags): array
    {
        foreach ($hashtags as $key => $value) {
            $successfullyAdded = $this->sendQuery("
                INSERT INTO ccp_hashtag
                (label_hashtag, id_course_sheet) VALUES (?, ?)
            ",
                [$value, $courseSheetId]);
            if (!$successfullyAdded) {
                throw new JSONException('One or more of hashtags is already associated with that course sheet');
            }
        }
        return [
            'message' => 'Successfully added hashtags',
        ];
    }

    public function removeHashtag(int $courseSheetId, string $hashtag): array
    {
        $this->sendQuery('
            SELECT label_hashtag
            FROM ccp_hashtag
            INNER JOIN ccp_coursesheet cc ON ccp_hashtag.id_course_sheet = cc.id_course_sheet
            WHERE cc.id_course_sheet = ?
            And label_hashtag = ?
        ',
            [$courseSheetId, $hashtag]);

        if ($result = $this->getQuery()->fetch()) {
            $successfullyRemoved = $this->sendQuery('
            DELETE FROM ccp_hashtag
            WHERE label_hashtag = ?
            AND id_course_sheet = ?
        ',
                [$hashtag, $courseSheetId]);
            if (!$successfullyRemoved) {
                throw new JSONException('Hashtag could not be removed');
            } else {
                return [
                    'message' => 'Hashtag was successfully removed',
                ];
            }
        } else {
            throw new InexistentHashtagException();
        }
    }

    public function getHashtags(int $courseSheetId): array
    {
        $this->sendQuery('
            SELECT label_hashtag
            FROM ccp_hashtag
            INNER JOIN ccp_coursesheet cc ON ccp_hashtag.id_course_sheet = cc.id_course_sheet
            WHERE cc.id_course_sheet = ?
        ',
            [$courseSheetId]);

        return $this->fetchData('Course sheet does not have any hashtag');
    }

    public function getPath(int $courseSheetId): string
    {
        $this->sendQuery('
            SELECT file_name FROM ccp_coursesheet
            WHERE id_course_sheet = ?
        ',
            [$courseSheetId]);

        if ($path = $this->getQuery()->fetch()) {
            return $path['file_name'];
        } else {
            throw new InexistentCourseSheetException();
        }
    }

    public function defaultFileExtension(): string
    {
        return 'pdf';
    }
}
