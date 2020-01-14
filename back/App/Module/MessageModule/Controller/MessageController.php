<?php

namespace App\Module\MessageController\Controller;

use App\Controller\AbstractController;
use App\Exception\JSONException;
use App\Http\JSONResponse;
use App\Module\MessageModule\Model\MessageModel;
use App\Module\LobbyModule\Model\LobbyModel;

class MessageController extends AbstractController
{
    public function __construct(MessageModel $model)
    {
        parent::__construct($model);
        $this->setActions([
            'getLobbiesByHashtag',
            'addHashtags',
            'removeHashtag',
            'getHashtags',
        ]);
    }

    public function run(): void
    {
        $this->checkAction();
        $this->checkToken();
        $result = [];

        $rightsOnCourseSheet = (new LobbyModel($this->getModel()->getConnection()))->checkRights(
            $this->getModel()->getLobbyId($this->getRequest()->getParam()),
            $this->getRequest()->getToken()
        );
        if ('admin' === $rightsOnCourseSheet) {
            switch ($this->getRequest()->getAction()) {
                case 'addHashtags':
                    $result = $this->getModel()->addHashtags($this->getRequest()->getParam(), $this->getRequest()->getHashtags());
                    break;

                case 'removeHashtag':
                    $result = $this->getModel()->removeHashtag($this->getRequest()->getParam(), $this->getRequest()->getHashtag());
                    break;

                case 'getHashtags':
                    $result = $this->getModel()->getHashtags($this->getRequest()->getParam());
                    break;
            }
        } else {
            new JSONException('You don\'t have the right to access this course sheet');
        }
        new JSONResponse($result);
    }
}