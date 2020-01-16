<?php

namespace App\Module\UserModule\Controller;

use App\Controller\AbstractController;
use App\Exception\RightException;
use App\Http\JSONResponse;
use App\Module\UserModule\Model\UserModel;

class UserController extends AbstractController
{
    public function __construct(UserModel $model)
    {
        parent::__construct($model);
        $this->setActions([
            'get_icon',
            'personal',
            'check_if_admin',
            'add_user',
            'remove_user',
            'users',
        ]);
    }

    public function run(): void
    {
        $this->checkAction();
        $idLobby = (int)$this->getRequest()->getIdLobby();
        $result = [];
        $this->checkRights($idLobby, $this->getRequest()->getToken());

        if ($this->userOrMore()) {
            $this->checkToken();
            switch ($this->getRequest()->getAction()) {
                case 'personal':
                    $this->checkToken();
                    $email = $this->getModel()->getUserFromToken($this->getRequest()->getToken())['email'];
                    $result = $this->getModel()->getPersonalInformation($email);
                    array_push($result, $this->getModel()->getPersonalLobbies($email));
                    break;

                case 'get_icon':
                    $icon = $this->getModel()->getIcon($idLobby, $this->getRequest()->getPath(), '/icon/');
                    $this->downloadFile($icon);
                    break;

                case 'users':
                    $result = $this->getModel()->getUsers($idLobby);
                    break;

                default:
                    if ($this->admin()) {
                        switch ($this->getRequest()->getAction()) {
                            case 'add_user':
                                $result = $this->getModel()->addUser($idLobby, $this->getRequest()->getEmail());
                                break;

                            case 'remove_user':
                                $result = $this->getModel()->removeUser($idLobby, $this->getRequest()->getParam());
                                break;

                            case 'check_if_admin':
                                $result = ['is_admin' => true];
                                break;
                        }
                    } else {
                        new RightException();
                    }
                    break;
            }
        } else {
            new RightException();
        }
        new JSONResponse($result);
    }
}