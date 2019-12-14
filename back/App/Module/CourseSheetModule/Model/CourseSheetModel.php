<?php

namespace App\Module\CourseSheetModule\Model;

use App\Model\AbstractModel;

class CourseSheetModel extends AbstractModel
{
    public function addCourseSheet(int $idLobby, string $title, string $fileName, string $tmpName, string $description): array
    {
        $this->uploadOnFTP($idLobby, $fileName, $tmpName, '/coursesheets/', AbstractModel::$COURSE_SHEET_EXTENSIONS);

        $successFullInsert = $this->send_query('
            INSERT INTO ccp_coursesheet
            (title, publication_date, file_name, description, id_lobby_contain)
            VALUES
            (?, NOW(), ?, ?, ?)
        ',
            [$title, $fileName, $description, $idLobby]);

        if ($successFullInsert) {
            return ['message' => 'Course sheet was successfully added'];
        } else {
            return ['message' => 'Course sheet could not be added'];
        }
    }
}
