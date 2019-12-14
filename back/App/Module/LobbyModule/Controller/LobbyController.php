<?php

namespace App\Module\LobbyModule\Controller;

use App\Controller\AbstractController;
use App\Exception\JSONException;
use App\Http\JSONResponse;

class LobbyController extends AbstractController
{
    private array $IMG_EXTENSIONS = ['jpg', 'jpeg', 'png', 'ico', 'svg'];

    public function run(): void
    {
        switch ($this->getRequest()->getAction()) {
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
                                $result = $this->getModel()->updateLobby($idLobby, ['description' => $this->getRequest()->getDescription()]);
                            }
                            if (isset($this->getRequest()->file)) {
                                $uploadedFileName = $this->getRequest()->getFile()['name'];
                                $extension = $this->getModel()->extension($uploadedFileName);
                                if (in_array($extension, $this->IMG_EXTENSIONS)) {
                                    $idLobby = $this->getRequest()->getParam();
                                    // add '_$idLobby' before file extension to differentiate lobbies images
                                    // with the same name
                                    $file = $this->getModel()->nameOnFTP($idLobby, $uploadedFileName, $extension);
                                    $newFileOnFTP = '/img/' . $file;

                                    // Update logo in database
                                    // But make a backup of old logo before to be able to update logo on ftp server
                                    $oldLogo = $this->getModel()->getLogo($idLobby);
                                    $this->getModel()->updateLobby($idLobby, ['logo' => '/img/' . $uploadedFileName]);

                                    $ftpServer = "cacompilepas_ftp_1";
                                    $ftpConnection = ftp_connect($ftpServer) or die(new JSONException("Could not connect to $ftpServer"));
                                    ftp_login($ftpConnection, 'cacompilepas', 'cacompilepas');

                                    // Delete old image on ftp server
                                    $oldLogoExtension = $this->getModel()->extension($oldLogo);
                                    $oldLogoNameOnFTPServer = $this->getModel()->nameOnFTP($idLobby, $oldLogo, $oldLogoExtension);

                                    // If file existed (it should), delete it
                                    $serverDirectoryContent = ftp_nlist($ftpConnection, '/img/');
                                    if ($serverDirectoryContent && in_array($oldLogoNameOnFTPServer, $serverDirectoryContent)) {
                                        ftp_delete($ftpConnection, $oldLogoNameOnFTPServer);
                                    }

                                    if (ftp_put($ftpConnection, $newFileOnFTP, $this->getRequest()->getFile()['tmp_name'], FTP_BINARY)) {
                                        new JSONResponse(['message' => "Successfully uploaded $uploadedFileName."]);
                                    } else {
                                        new JSONException("Could not connect to $ftpServer");
                                    }
                                    ftp_close($ftpConnection);
                                } else {
                                    new JSONException("$extension is not a proper image type");
                                }
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