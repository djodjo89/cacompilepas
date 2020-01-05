<?php

namespace App\Module\ConnectionModule\Controller;

use App\Controller\AbstractController;
use App\Http\JSONResponse;
use App\Module\ConnectionModule\Model\ConnectionModel;

class ConnectionController extends AbstractController
{
    public function run(): void
    {
        $result = [];
        switch ($this->getRequest()->getAction()) {
            case 'login':
                $email = $this->getRequest()->getEmail();
                $password = $this->getRequest()->getPassword();
                $idUser = $this->getModel()->checkIfUserExists($email, $password)['id_user'];
                if ($idUser) {
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

            case 'personal':
                $this->checkToken();
                $email = $this->getModel()->getUserFromToken($this->getRequest()->getToken())['email'];
                $result = $this->getModel()->getPersonalInformation($email);
                array_push($result, $this->getModel()->getPersonalLobbies($email));
                break;

            case 'getIcon':
                $this->checkToken();
                $icon = $this->getModel()->getIcon($this->getRequest()->getParam(), $this->getRequest()->getPath(), '/icon/');
                $this->downloadFile($icon);
                break;

            case 'inscription' :
                $prenom = $this->getRequest()->getPrenom();
                $nom = $this->getRequest()->getNom();
                $pseudo = $this->getRequest()->getPseudo();
                $email = $this->getRequest()->getEmail();
                $password = $this->getRequest()->getPassword();

               $modelConnection = new ConnectionModel();
               $result = $modelConnection->newInscription($prenom,$nom,$pseudo,$email,$password);
                break;
        }

        new JSONResponse($result);
    }
}
