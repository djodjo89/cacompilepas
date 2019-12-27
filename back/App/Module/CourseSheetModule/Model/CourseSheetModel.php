<?php

namespace App\Module\CourseSheetModule\Model;

use App\Model\AbstractModel;

class CourseSheetModel extends AbstractModel
{
    public function getLobby(int $idCourseSheet): array
    {
        $this->send_query('
            SELECT id_lobby_contain
            FROM ccp_coursesheet
            WHERE id_course_sheet = ?
        ',
            [$idCourseSheet]);

        return $this->fetchData(['message' => 'An error occurred when trying to get containing lobby']);
    }

    public function addCourseSheet(int $idLobby, string $title, string $fileName, string $tmpName, string $description, array $hashtags): array
    {
        $this->uploadOnFTP($idLobby, $fileName, $tmpName, '/coursesheets/', AbstractModel::$COURSE_SHEET_EXTENSIONS);

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

        $idCourseSheet = $this->getQuery()->fetch();

        foreach ($hashtags as $key => $value) {
            if ($successfulInsert) {
                $successfulInsert = $this->send_query('
                INSERT INTO ccp_hashtag
                (label_hashtag, id_course_sheet) 
                VALUES 
                (?, ?)
            ',
                    [$value, $idCourseSheet[0]]);
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
        $successfulDelete = $this->send_query('
            DELETE FROM ccp_coursesheet
            WHERE id_lobby_contain = ?
            AND id_course_sheet = ?
        ',
            [$idLobby, $idCourseSheet]);
        if ($successfulDelete) {
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

    public function removeHashtag(string $hashtag): array
    {
        $successfullyRemoved = $this->send_query('
            DELETE FROM ccp_hashtag
            WHERE label_hashtag = ?
        ',
            [$hashtag]);
        if (!$successfullyRemoved) {
            return ['message' => 'Hashtag could not be removed'];
        } else {
            return ['message' => 'Hashtag was successfully removed'];
        }
    }
}
