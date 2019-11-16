<?php

class CourseSheetWiew extends View{
	
	function display_CourseSheet($tab) {

		foreach ($tab as $key) {

            echo '<a href ="index.php?module=coursesheet&action=getCourseSheet&id='.$key['id'].'"> '.$key['title'].' </a>' ;
            echo '<a href ="index.php?module=coursesheet&action=getCourseSheet&id='.$key['id'].'"> '.$key['publication_date'].' </a>' ;
            echo '<a href ="index.php?module=coursesheet&action=getCourseSheet&id='.$key['id'].'"> '.$key['link'].' </a>' ;
            echo '<a href ="index.php?module=coursesheet&action=getCourseSheet&id='.$key['id'].'"> '.$key['id_lobby'].' </a>' ;

		}
	}

    

}

?>