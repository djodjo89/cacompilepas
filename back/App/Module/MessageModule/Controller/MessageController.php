<?php

namespace App\Module\MessageModule\Controller;

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
            'deleteMessage',
        ]);
    }

    public function run(): void
    {
        $this->checkAction();
        $this->checkToken();
        $result = [];

        $rightsOnCourseSheet = (new LobbyModel($this->getModel()->getConnection()))->checkRights(
            $this->getRequest()->getParam(),
            $this->getRequest()->getToken()
        );
        if ('admin' === $rightsOnCourseSheet) {
            switch ($this->getRequest()->getAction()) {
                case 'deleteMessage':
                    $result = (new MessageModel($this->getModel()->getConnection()))->deleteMessage((int)$this->getRequest()->getId());
                    break;
            }
        } else {
            new JSONException('You don\'t have the right to access this message');
        }
        new JSONResponse($result);
    }
}