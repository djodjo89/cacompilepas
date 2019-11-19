<?php
    require_once 'CourseSheetView.php'
    require_once 'CourseSheetModel.php'

class CourseSheetController {
    private $CourseSheetView;
    private $CourseSheetModel;


    public function __construct(){
        $this-> CourseSheetView = new CourseSheetView();
        $this-> modelCourseModem = new CourseSheetModel();
    }

    public function run(){

    }

    public function getCourseSheet($id_course_sheet){
        return $this->CourseSheetView->display_CourseSheet($this->CourseSheetModel->getCourseSheet($id_course_sheet))
    }

}

?>