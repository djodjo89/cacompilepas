<?php

namespace App\Module\CourseSheetModule\Controller;

use App\Controller\AbstractController;
use App\Http\JSONResponse;
use App\Module\CourseSheetModule\Model\CourseSheetModel;

class CourseSheetController extends AbstractController
{
    public function __construct(CourseSheetModel $model)
    {
        parent::__construct($model);
        $this->setActions([
            'getLobbiesByHashtag',
            'addHashtags',
            'removeHashtag',
        ]);
    }

    public function run(): void
    {
        $this->checkAction();
        $this->checkToken();
        $result = [];
        switch ($this->getRequest()->getAction()) {
            case 'addHashtags':
                $result = $this->getModel()->addHashtags($this->getRequest()->getParam(), $this->getRequest()->getHashtags());
                break;

            case 'removeHashtag':
                $result = $this->getModel()->removeHashtag($this->getRequest()->getParam());
                break;
        }
        new JSONResponse($result);
    }
}