<?php

namespace App\Module\UserModule\Controller;

use App\Controller\LinkedWithLobbyController;
use App\Exception\RightException;
use App\Http\FileResponse;
use App\Http\JSONException;
use App\Http\Request;
use App\Module\LobbyModule\Exception\InexistentLobbyException;
use App\Module\UserModule\Exception\InexistentUserException;
use App\Module\UserModule\Fetcher\UserFetcher;
use App\Module\UserModule\Model\UserModel;

class UserController extends LinkedWithLobbyController
{

    public function __construct(UserModel $model)
    {
        parent::__construct(
            $model,[
            'get_icon',
            'personal',
            'check_if_admin',
            'add_user',
            'remove_user',
            'users',
            'add_write_right',
            'remove_write_right',
        ],
            new UserFetcher($model, new Request())
        );
    }

    protected function execute(): void
    {
        switch ($this->getRequest()->getAction()) {
            case 'personal':
                $this->checkToken();
                $email = $this->getModel()->getUserFromToken($this->getRequest()->getToken())['email'];
                $result = $this->getModel()->getPersonalInformation($email);
                array_push($result['data'], $this->getModel()->getPersonalLobbies($email)['data']);
                $this->setJSONResponse($result);
                break;

            case 'get_icon':
                try {
                    $icon = $this->getModel()->getOnFTP((int)$this->getRequest()->getParam(), '/icon/');
                } catch (InexistentUserException $e) {
                    $this->setResponse(new JSONException($e->getMessage()));
                }
                $this->setResponse(new FileResponse($icon));
                break;

            default:
                if ($this->userOrMore()) {
                    $this->checkToken();
                    switch ($this->getRequest()->getAction()) {
                        case 'users':
                            $this->setJSONResponse($this->getModel()->getUsers($this->getLobbyId()));
                            break;

                        default:
                            if ($this->admin()) {
                                switch ($this->getRequest()->getAction()) {
                                    case 'add_user':
                                        $this->setJSONResponse($this->getModel()->addUser($this->getLobbyId(), $this->getRequest()->getEmail()));
                                        break;

                                    case 'remove_user':
                                        $this->setJSONResponse($this->getModel()->removeUser($this->getLobbyId(), $this->getRequest()->getParam()));
                                        break;

                                    case 'check_if_admin':
                                        $this->setJSONResponse([]);
                                        break;

                                    case 'add_write_right':
                                        $this->setJSONResponse($this->getModel()->addWriteRight($this->getLobbyId(), $this->getRequest()->getParam()));
                                        break;

                                    case 'remove_write_right':
                                        $this->setJSONResponse($this->getModel()->removeWriteRight($this->getLobbyId(), $this->getRequest()->getParam()));
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
                } else {
                    throw new RightException();
                }
                break;
        }
    }
}