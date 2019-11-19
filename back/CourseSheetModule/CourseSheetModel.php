<?php
    require_once '.../connection/Connection.php'

public class CourseSheetModel extends Connection {

    public function getCourseSheet($id_course_sheet){
        $selectPrepare = Connection::$bdd -> prepare('select * from CourseSheet where id_course_sheet=?')
        $selectPrepare -> execute($array($id_course_sheet));
        $courseSheet = $selectPrepare -> fetchAll();
        return $courseSheet; 
    }
}


?>