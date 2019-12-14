<?php

namespace App\Module\ConnectionModule\Controller;

use App\Controller\AbstractController;
use App\Http\JSONResponse;

class ConnectionController extends AbstractController
{
    public function run(): void
    {
        switch ($this->getRequest()->getAction()) {
            case 'login':
                $email = $this->getRequest()->getEmail();
                $password = $this->getRequest()->getPassword();
                $idUser = $this->getModel()->checkIfUserExists($email, $password)['id_user'];
                if ($idUser) {
                    new JSONResponse([
                        'token' => $this->getModel()->generateToken($email, $password, $idUser),
                        'connected' => true,
                    ]);
                } else {
                    new JSONResponse([
                        'connected' => false,
                    ]);
                }
                break;
            // Check if a token is valid
            case 'verification':
                $token_exists = $this->getModel()->checkToken($this->getRequest()->getToken());
                new JSONResponse([
                    'token_exists' => $token_exists ? true : false,
                ]);
                break;
        }
    }
}
