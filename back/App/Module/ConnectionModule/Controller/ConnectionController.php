<?php

namespace App\Module\ConnectionModule\Controller;

use App\Controller\AbstractController;
use App\Http\JSONResponse;
use App\Model\AbstractModel;
use App\Module\UserModule\Model\UserModel;

class ConnectionController extends AbstractController
{
    public function __construct(AbstractModel $model)
    {
        parent::__construct($model);
        $this->setActions([
            'login',
            'verification',
            'disconnect',
            'register',
        ]);
    }

    public function run(): void
    {
        $this->checkAction();
        $result = [];
        switch ($this->getRequest()->getAction()) {
            case 'login':
                $email = $this->getRequest()->getEmail();
                $password = $this->getRequest()->getPassword();
                if (0 !== count((new UserModel($this->getModel()->getConnection()))->checkIfUserExists($email, $password))) {
                    $idUser = (new UserModel($this->getModel()->getConnection()))->checkIfUserExists($email, $password)['id_user'];
                    $result = [
                        'token' => $this->getModel()->generateToken($email, $password, $idUser),
                        'connected' => true,
                    ];
                } else {
                    $result = [
                        'connected' => false,
                    ];
                }
                break;

            // Check if a token is valid
            case 'verification':
                $token_exists = $this->getModel()->checkToken($this->getRequest()->getToken());
                $result = [
                    'token_exists' => $token_exists ? true : false,
                ];
                break;

            case 'disconnect':
                $this->checkToken();
                $email = $this->getModel()->getUserFromToken($this->getRequest()->getToken())['email'];
                $result = $this->getModel()->disconnect($email);
                break;

            case 'register':
                $result = $this->getModel()->register(
                    $this->getRequest()->getPseudo(),
                    $this->getRequest()->getFirstName(),
                    $this->getRequest()->getLastName(),
                    $this->getRequest()->getFile()['name'],
                    $this->getRequest()->getFile()['tmp_name'],
                    $this->getRequest()->getPassword(),
                    $this->getRequest()->getConfirmPassword(),
                    $this->getRequest()->getEmail(),
                );
        }
        new JSONResponse($result);
    }
}
