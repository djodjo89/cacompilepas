<?php

namespace App\Module\CourseSheetModule;

use App\Module\AbstractModule;
use App\Module\CourseSheetModule\Controller\CourseSheetController;

class CourseSheetModule extends AbstractModule
{
    public function __construct(CourseSheetController $controller)
    {
        parent::__construct($controller);
    }
}