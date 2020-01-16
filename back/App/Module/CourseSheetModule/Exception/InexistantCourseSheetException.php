<?php

namespace App\Module\CourseSheetModule\Exception;

use InexistentException;

class InexistentCourseSheetException extends InexistentException
{
    public function __construct()
    {
        parent::__construct('course sheet');
    }
}