<?php

namespace App\Module\CourseSheetModule\Exception;

use App\Exception\InexistentException;

class InexistentHashtagException extends InexistentException
{
    public function __construct()
    {
        parent::__construct('hashtag');
    }
}