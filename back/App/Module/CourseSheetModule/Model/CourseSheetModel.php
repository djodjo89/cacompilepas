<?php

namespace App\Module\CourseSheetModule\Model;

use App\Exception\JSONException;
use App\Model\AbstractModel;

class CourseSheetModel extends AbstractModel
{
    public function addCourseSheet(int $idLobby, string $title, string $fileName, string $tmpName, string $description): array
    {
        $this->uploadOnFTP($idLobby, $fileName, $tmpName, '/coursesheets/', AbstractModel::$COURSE_SHEET_EXTENSIONS);

        $successfulInsert = $this->send_query('
            INSERT INTO ccp_coursesheet
            (title, publication_date, file_name, description, id_lobby_contain)
            VALUES
            (?, NOW(), ?, ?, ?)
        ',
            [$title, $fileName, $description, $idLobby]);

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
            return ['message' => 'Course sheet was successfully deleted'];
        } else {
            return ['message' => 'Course sheet could not be deleted'];
        }
    }
}
