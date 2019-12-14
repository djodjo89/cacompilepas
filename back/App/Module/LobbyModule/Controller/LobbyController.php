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
            case 'upload-pdf':
                var_dump($_FILES);
                $ftpServer = "cacompilepas_ftp_1";
                $ftpConnection = ftp_connect($ftpServer) or die(new JSONException("Could not connect to $ftpServer"));
                ftp_login($ftpConnection, 'cacompilepas', 'cacompilepas');
                $file = $_FILES['file']['name'];
                $newFile = '/coursesheets/' . $file;
                if (ftp_put($ftpConnection, $newFile, $_FILES['file']['tmp_name'], FTP_BINARY))
                {
                    new JSONResponse(['message' => "Successfully uploaded $file."]);
                }
                else
                {
                    new JSONException("Could not connect to $ftpServer");
                }

                // close connection
                ftp_close($ftpConnection);
                break;
            case 'coursesheets' || 'messages' || 'lobby' || 'update':
                $this->checkToken();
                $idLobby = (int)$this->getRequest()->getParam();
                $result = [];
                if ($this->getModel()->checkRights($idLobby, $this->getRequest()->getToken())) {
                    switch ($this->getRequest()->getAction()) {
                        case 'coursesheets':
                            $result = $this->getModel()->getCourseSheets($idLobby);
                            break;

                        case 'messages':
                            $result = $this->getModel()->getMessages($idLobby);
                            break;

                        case 'consult':
                            $result = $this->getModel()->getLobbyById($idLobby);
                            break;

                        case 'update':
                            if (isset($this->getRequest()->label)) {
                                $result = $this->getModel()->updateLobby($idLobby, ['label_lobby' => $this->getRequest()->getLabel()]);
                            }
                            if (isset($this->getRequest()->description)) {
                                $result = $this->getModel()->updateLobby($idLobby, ['description' =>$this->getRequest()->getDescription()]);
                            }
                            break;
                    }
                } else {
                    new JSONException('You don\'t have the right to access this lobby');
                }
                new JSONResponse($result);
                break;



            default:
                new JSONException($this->getRequest()->getAction() . ' action doesn\'t exists');
                break;
        }
    }
}