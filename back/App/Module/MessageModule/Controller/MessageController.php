<?php

namespace App\Module\MessageModule\Controller;

use App\Controller\AbstractController;
use App\Exception\RightException;
use App\Http\JSONResponse;
use App\Module\MessageModule\Model\MessageModel;
use App\Module\LobbyModule\Model\LobbyModel;

class MessageController extends AbstractController
{
    public function __construct(MessageModel $model)
    {
        parent::__construct($model);
        $this->setActions([
            'messages',
            'add_message',
            'delete_message',
        ]);
    }

    public function run(): void
    {
        $this->checkAction();
        $idLobby = (int)$this->getRequest()->getIdLobby();
        $result = [];

        $this->checkRights($idLobby,$this->getRequest()->getToken());

        if ($this->userOrMore()) {
            $this->checkToken();
            switch ($this->getRequest()->getAction()) {
                case 'add_message':
                    $result = $this->getModel()->addMessage($idLobby, $this->getModel()->idUserFromToken($this->getRequest()->getToken()), $this->getRequest()->getContent());
                    break;
                default:
                    if ($this->admin()) {
                        switch ($this->getRequest()->getAction()) {
                            case 'delete_message':
                                $result = $this->getModel()->deleteMessage((int)$this->getRequest()->getParam());
                                break;
                        }
                    } else {
                        new RightException();
                    }
                    break;
            }
        } else {
            switch ($this->getRequest()->getAction()) {
                case 'messages':
                    $result = $this->getModel()->getMessages($idLobby);
                    break;

                default:
                    new RightException();
                    break;
            }
        }
        new JSONResponse($result);
    }
}