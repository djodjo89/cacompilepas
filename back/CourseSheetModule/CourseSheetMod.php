<?php

require_once 'CourseSheetController.php';

class CourseSheetMod{

	public function __construct(){

		$controller = new CourseSheetController();

		if(isset($_GET['action'])){
			$action = $_GET['action'];
			
			switch($action){
				case 'coursesheet':
					$controller -> getCourseSheet($_GET['id_course_sheet'])
					break;
			
			}
		}

	}
}
?>