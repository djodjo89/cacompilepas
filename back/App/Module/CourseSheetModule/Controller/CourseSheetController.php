<?php

namespace App\Module\CourseSheetModule\Controller;

use App\Controller\AbstractController;
use App\Exception\JSONException;
use App\Http\JSONResponse;
use App\Module\CourseSheetModule\Model\CourseSheetModel;
use App\Module\LobbyModule\Model\LobbyModel;

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
        $rightsOnCourseSheet = (new LobbyModel($this->getModel()->getConnection()))->checkRights($this->getModel()->getLobby($this->getRequest()->getParam(), $this->getRequest()->getToken()));
        if ('admin' !== $rightsOnCourseSheet) {
            switch ($this->getRequest()->getAction()) {
                case 'addHashtags':
                    $result = $this->getModel()->addHashtags($this->getRequest()->getParam(), $this->getRequest()->getHashtags());
                    break;

                case 'removeHashtag':
                    $result = $this->getModel()->removeHashtag($this->getRequest()->getParam());
                    break;
            }
        } else {
            new JSONException('You don\'t have the right to access this course sheet');
        }
        new JSONResponse($result);
    }
}