<?php

namespace App\Module\CourseSheetModule\Model;

use App\Exception\IncorrectFileExtension;
use App\Http\JSONException;
use App\Model\AbstractFileModel;
use App\Model\AbstractModel;
use App\Module\CourseSheetModule\Exception\InexistentCourseSheetException;
use App\Module\LobbyModule\Exception\InexistentLobbyException;

class CourseSheetModel extends AbstractFileModel
{
    public function getLobbyId(int $courseSheetId): int
    {
        $this->send_query('
            SELECT id_course_sheet
            FROM ccp_coursesheet
            WHERE id_course_sheet = ?
        ',
            [$courseSheetId]);

        if ($result = $this->getQuery()->fetch()) {
            $this->send_query('
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
        return $this->fetchData('Lobby does not contain any course sheet');
    }

    public function addCourseSheet(int $idLobby, string $title, string $fileName, string $tmpName, string $description, array $hashtags): array
    {
        $successfulInsert = $this->send_query('
            INSERT INTO ccp_coursesheet
            (title, publication_date, file_name, description, id_lobby_contain)
            VALUES
            (?, NOW(), ?, ?, ?)
        ',
            [$title, $fileName, $description, $idLobby]);

        $this->send_query('
            SELECT id_course_sheet
            FROM ccp_coursesheet
            ORDER BY id_course_sheet DESC
            LIMIT 1
        ',
            []);

        $courseSheetId = (int)$this->getQuery()->fetch()[0];

        try {
            $this->uploadOnFTP($idLobby, $fileName, $tmpName, '/coursesheets/', AbstractModel::$COURSE_SHEET_EXTENSIONS);
        } catch (IncorrectFileExtension $e) {
            throw new JSONException($e->getMessage());
        }

        foreach ($hashtags as $key => $value) {
            if ($successfulInsert && $successfulUpload) {
                $successfulInsert = $this->send_query('
                INSERT INTO ccp_hashtag
                (label_hashtag, id_course_sheet) 
                VALUES 
                (?, ?)
            ',
                    [$value, $courseSheetId]);
            }
        }

        if ($successfulInsert && $successfulUpload) {
            return [
                'message' => 'Course sheet was successfully added',
            ];
        } else {
            throw new JSONException('Course sheet could not be added');
        }
    }

    public function deleteCourseSheet(int $idLobby, $courseSheetId): array
    {
        $this->send_query('
                SELECT file_name
                FROM ccp_coursesheet
                WHERE id_course_sheet = ?
            ',
            [$courseSheetId]);
        $fileName = $this->getQuery()->fetch()['file_name'];

        $successfulDelete = $this->send_query('
            DELETE FROM ccp_coursesheet
            WHERE id_lobby_contain = ?
            AND id_course_sheet = ?
        ',
            [$idLobby, $courseSheetId]);
        if ($successfulDelete) {
            $this->send_query('
                SELECT file_name
                FROM ccp_coursesheet
                WHERE id_course_sheet = ?
            ',
                [$courseSheetId]);

            $oldFileNameOnFTPServer = '/coursesheets/' . $this->nameOnFTP($courseSheetId, $fileName, $this->extension($fileName));
            $this->deleteOnFTP($oldFileNameOnFTPServer, '/coursesheets/');

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
            $successfullyAdded = $this->send_query("
                INSERT INTO ccp_hashtag
                (label_hashtag, id_course_sheet) VALUES (?, ?)
            ",
                [$value, $courseSheetId]);
            if (!$successfullyAdded) {
                throw new JSONException('Hashtags could not be added');
            }
        }
        return [
            'message' => 'Successfully added hashtags',
        ];
    }

    public function removeHashtag(int $courseSheetId, string $hashtag): array
    {
        $successfullyRemoved = $this->send_query('
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
    }

    public function getHashtags(int $courseSheetId): array
    {
        $this->send_query('
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
        $this->send_query('
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
}
