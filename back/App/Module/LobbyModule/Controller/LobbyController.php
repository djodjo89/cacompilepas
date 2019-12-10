<?php

namespace App\Module\LobbyModule\Controller;


use App\Controller\AbstractController;
use App\Exception\JSONException;
use App\Http\JSONResponse;

class LobbyController extends AbstractController
{
    public function run(): void
    {
        switch ($this->getRequest()->getAction()) {
            case 'coursesheets' || 'messages' || 'lobby':
                $this->checkToken();
                $idLobby = (int)$this->getRequest()->getParam();
                $result = [];
                switch ($this->getRequest()->getAction()) {
                    case 'coursesheets':
                        $result = $this->getModel()->getCourseSheets($idLobby);
                        break;

                    case 'messages':
                        $result = $this->getModel()->getMessages($idLobby);
                        break;

                    case 'lobby':
                        $result = $this->getModel()->getLobbyById($idLobby);
                        break;
                }
                new JSONResponse($result);
                break;

            default:
                new JSONException($this->getRequest()->getAction() . ' action doesn\'t exists');
                break;
        }
    }
}