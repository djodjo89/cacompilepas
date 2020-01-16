<?php

namespace App\Module\LobbyModule\Controller;

use App\Controller\AbstractController;
use App\Exception\RightException;
use App\Http\JSONResponse;
use App\Module\LobbyModule\Model\LobbyModel;
use App\Module\UserModule\Model\UserModel;

class LobbyController extends AbstractController
{
    public function __construct(LobbyModel $model)
    {
        parent::__construct($model);
        $this->setActions([
            'consult',
            'make_private',
            'make_public',
            'update',
            'visibility',
            'search',
            'get_lobbies',
            'get_logo',
            'delete',
            'create',
            'get_icon',
        ]);
    }

    public function run(): void
    {
        $this->checkAction();
        $idLobby = (int)$this->getRequest()->getParam();
        $result = [];
        if (0 !== $idLobby) {
            $this->checkToken();

            if (-1 === $idLobby) {
                $result = $this->getModel()->create(
                    $this->getModel()->idUserFromToken($this->getRequest()->getToken()),
                    $this->getRequest()->getLabel(),
                    $this->getRequest()->getDescription(),
                    $this->getRequest()->getPrivate(),
                    $this->getRequest()->getFile()['name'],
                    $this->getRequest()->getFile()['tmp_name'],
                    );

                $idLobby = $result['id_lobby'];
            }
        }

        $this->checkRights($idLobby, $this->getRequest()->getToken());

        if ($this->visitorOrMore()) {
            switch ($this->getRequest()->getAction()) {
                case 'consult':
                    $result = $this->getModel()->getLobbyById($idLobby);
                    break;

                case 'get_logo':
                    $logo = $this->getModel()->getFile((int)$this->getRequest()->getParam(), $this->getRequest()->getPath(), '/logo/');
                    $this->downloadFile($logo);
                    break;

                case 'get_lobbies':
                    $result = $this->getModel()->getLobbies();
                    break;

                default:
                    if ($this->admin()) {
                        switch ($this->getRequest()->getAction()) {
                            case 'make_private':
                                $result = $this->getModel()->makePrivate($idLobby);
                                break;

                            case 'make_public':
                                $result = $this->getModel()->makePublic($idLobby);
                                break;

                            case 'update':
                                if (isset($this->getRequest()->label)) {
                                    $result['message_label'] = $this->getModel()->updateLobby($idLobby, ['label_lobby' => $this->getRequest()->getLabel()])['message'];
                                }
                                if (isset($this->getRequest()->description)) {
                                    $result['message_description'] = $this->getModel()->updateLobby($idLobby, ['description' => $this->getRequest()->getDescription()])['message'];
                                }
                                if (isset($this->getRequest()->file)) {
                                    $result['message_logo'] = $this->getModel()->updateLogo(
                                        $idLobby,
                                        $this->getRequest()->getFile()['name'],
                                        $this->getRequest()->getFile()['tmp_name'],
                                        )['message'];
                                    $result['path'] = $this->getRequest()->getFile()['name'];
                                }
                                break;

                            case 'visibility':
                                $result = $this->getModel()->getVisibility($idLobby);
                                break;

                            case 'delete':
                                $result = $this->getModel()->delete((int)$this->getRequest()->getParam());
                                break;

                            default:
                                throw new RightException();
                                break;
                        }
                    } else {
                        throw new RightException();
                    }
            }
        } else {
            switch ($this->getRequest()->getAction()) {
                case 'search':
                    $users = (new UserModel($this->getModel()->getConnection()))->searchUsers($this->getRequest()->getSearch());
                    $lobbies = $this->getModel()->searchLobbies($this->getRequest()->getSearch(), $this->getRequest()->getHashtags());
                    $result = array_merge($users, $lobbies);
                    break;

                default:
                    throw new RightException();
                    break;
            }
        }
        new JSONResponse($result);
    }
}
