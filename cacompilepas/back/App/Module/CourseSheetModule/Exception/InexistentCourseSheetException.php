<?php

namespace App\Module\CourseSheetModule\Exception;

use App\Exception\InexistentException;

class InexistentCourseSheetException extends InexistentException
{
    public function __construct()
    {
        parent::__construct('course sheet');
    }
}
