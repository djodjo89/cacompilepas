<?php

namespace App\Module\MessageModule\Controller;

use App\Controller\LinkedWithLobbyController;
use App\Exception\RightException;
use App\Http\JSONException;
use App\Http\Request;
use App\Module\LobbyModule\Exception\InexistentLobbyException;
use App\Module\MessageModule\Fetcher\MessageFetcher;
use App\Module\MessageModule\Model\MessageModel;
use App\Module\UserModule\Model\UserModel;

class MessageController extends LinkedWithLobbyController
{

    public function __construct(MessageModel $model)
    {
        parent::__construct(
            $model,
            [
                'messages',
                'add_message',
                'delete_message',
            ],
            new MessageFetcher($model, new Request())
        );
    }

    protected function execute(): void
    {
        if ($this->visitorOrMore()) {
            switch ($this->getRequest()->getAction()) {
                case 'messages':
                    $this->setJSONResponse($this->getModel()->getMessages($this->getLobbyId()));
                    break;

                default:
                    if ($this->userOrMore()) {
                        $this->checkToken();
                        switch ($this->getRequest()->getAction()) {
                            case 'add_message':
                                $this->setJSONResponse($this->getModel()->addMessage($this->getLobbyId(), (new UserModel($this->getModel()->getConnection()))->userIdFromToken($this->getRequest()->getToken()), $this->getRequest()->getContent()));
                                break;
                            default:
                                if ($this->admin()) {
                                    switch ($this->getRequest()->getAction()) {
                                        case 'delete_message':
                                            $this->setJSONResponse($this->getModel()->deleteMessage((int)$this->getRequest()->getParam()));
                                            break;

                                        default:
                                            throw new RightException();
                                            break;
                                    }
                                } else {
                                    throw new RightException();
                                }
                                break;
                        }
                        break;
                    } else {
                        throw new RightException();
                    }
                    break;
            }
        } else {
            throw new RightException();
        }
    }
}
