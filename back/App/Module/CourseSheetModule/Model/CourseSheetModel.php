<?php

namespace App\Module\CourseSheetModule\Model;

use App\Model\AbstractModel;

class CourseSheetModel extends AbstractModel
{
    public function getLobbyId(int $idCourseSheet): int
    {
        $this->send_query('
            SELECT id_lobby_contain
            FROM ccp_coursesheet
            WHERE id_course_sheet = ?
        ',
            [$idCourseSheet]);

        return $this->fetchData(['message' => 'An error occurred when trying to get containing lobby'])[0]['id_lobby_contain'];
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

        $idCourseSheet = (int)$this->getQuery()->fetch()[0];

        $this->uploadOnFTP($idLobby, $fileName, $tmpName, '/coursesheets/', AbstractModel::$COURSE_SHEET_EXTENSIONS);

        foreach ($hashtags as $key => $value) {
            if ($successfulInsert) {
                $successfulInsert = $this->send_query('
                INSERT INTO ccp_hashtag
                (label_hashtag, id_course_sheet) 
                VALUES 
                (?, ?)
            ',
                    [$value, $idCourseSheet]);
            }
        }

        if ($successfulInsert) {
            return ['message' => 'Course sheet was successfully added'];
        } else {
            return ['message' => 'Course sheet could not be added'];
        }
    }

    public function deleteCourseSheet(int $idLobby, $idCourseSheet): array
    {
        $this->send_query('
                SELECT file_name
                FROM ccp_coursesheet
                WHERE id_course_sheet = ?
            ',
            [$idCourseSheet]);
        $fileName = $this->getQuery()->fetch()['file_name'];

        $successfulDelete = $this->send_query('
            DELETE FROM ccp_coursesheet
            WHERE id_lobby_contain = ?
            AND id_course_sheet = ?
        ',
            [$idLobby, $idCourseSheet]);
        if ($successfulDelete) {
            $this->send_query('
                SELECT file_name
                FROM ccp_coursesheet
                WHERE id_course_sheet = ?
            ',
                [$idCourseSheet]);

            $oldFileNameOnFTPServer = '/coursesheets/' . $this->nameOnFTP($idCourseSheet, $fileName, $this->extension($fileName));
            $this->deleteOnFTP($oldFileNameOnFTPServer, '/coursesheets/');

            return [
                'message' => 'Course sheet was successfully deleted',
            ];
        } else {
            return ['message' => 'Course sheet could not be deleted'];
        }
    }

    public function addHashtags(int $idCourseSheet, array $hashtags): array
    {
        foreach ($hashtags as $key => $value) {
            $successfullyAdded = $this->send_query("
                INSERT INTO ccp_hashtag
                (label_hashtag, id_course_sheet) VALUES (?, ?)
            ",
                [$value, $idCourseSheet]);
            if (!$successfullyAdded) {
                return ['message' => 'Hashtags could not be added'];
            }
        }
        return ['message' => 'Successfully added hashtags'];
    }

    public function removeHashtag(int $idCourseSheet, string $hashtag): array
    {
        $successfullyRemoved = $this->send_query('
            DELETE FROM ccp_hashtag
            WHERE label_hashtag = ?
            AND id_course_sheet = ?
        ',
            [$hashtag, $idCourseSheet]);
        if (!$successfullyRemoved) {
            return ['message' => 'Hashtag could not be removed'];
        } else {
            return ['message' => 'Hashtag was successfully removed'];
        }
    }

    public function getHashtags(int $idCourseSheet): array
    {
        $this->send_query('
            SELECT label_hashtag
            FROM ccp_hashtag
            INNER JOIN ccp_coursesheet cc on ccp_hashtag.id_course_sheet = cc.id_course_sheet
            WHERE cc.id_course_sheet = ?
        ',
            [$idCourseSheet]);

        return $this->fetchData(['message' => 'Course sheet doesn\'t have any hashtag']);
    }
}
