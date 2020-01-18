<?php

namespace App\Module\LobbyModule\Controller;

use App\Controller\LinkedWithLobbyController;
use App\Exception\MissingParameterException;
use App\Exception\RightException;
use App\Http\FileResponse;
use App\Http\JSONException;
use App\Module\LobbyModule\Exception\InexistentLobbyException;
use App\Module\LobbyModule\Fetcher\LobbyFetcher;
use App\Module\LobbyModule\Model\LobbyModel;
use App\Module\UserModule\Model\UserModel;

class LobbyController extends LinkedWithLobbyController
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
        ]);
        $this->setFetcher(new LobbyFetcher($this->getModel(), $this->getRequest()));
    }

    protected function execute(): void
    {
        switch ($this->getRequest()->getAction()) {
            case 'get_lobbies':
                $this->setJSONResponse($this->getModel()->getLobbies());
                break;

            case 'search':
                $users = [];
                $lobbies = [];
                try {
                    $users = (new UserModel($this->getModel()->getConnection()))->searchUsers($this->getRequest()->getSearch());
                } catch (JSONException $e) {
                }
                try {
                    $lobbies = $this->getModel()->searchLobbies($this->getRequest()->getSearch(), $this->getRequest()->getHashtags());
                } catch (JSONException $e) {
                }
                $this->setJSONResponse(array_merge($users, $lobbies));
                break;

            default:
                if ($this->connected() && 'create' === $this->getRequest()->getAction()) {
                    $this->checkToken();
                    $this->setJSONResponse($this->getModel()->create(
                        (new UserModel($this->getModel()->getConnection()))->userIdFromToken($this->getRequest()->getToken()),
                        $this->getRequest()->getLabel(),
                        $this->getRequest()->getDescription(),
                        $this->getRequest()->getPrivate(),
                        $this->getRequest()->getFile()['name'],
                        $this->getRequest()->getFile()['tmp_name'],
                        )
                    );
                } else {
                    if ($this->visitorOrMore()) {
                        switch ($this->getRequest()->getAction()) {
                            case 'consult':
                                $this->setJSONResponse($this->getModel()->getLobbyById($this->getLobbyId()));
                                break;

                            case 'get_logo':
                                $logo = '';
                                try {
                                    $logo = $this->getModel()->getOnFTP((int)$this->getRequest()->getParam(), '/logo/');
                                } catch (InexistentLobbyException $e) {
                                    $this->setResponse(new JSONException($e->getMessage()));
                                }
                                $this->setResponse(new FileResponse($logo));
                                break;

                            default:
                                if ($this->admin()) {
                                    switch ($this->getRequest()->getAction()) {
                                        case 'make_private':
                                            $this->setJSONResponse($this->getModel()->makePrivate($this->getLobbyId()));
                                            break;

                                        case 'make_public':
                                            $this->setJSONResponse($this->getModel()->makePublic($this->getLobbyId()));
                                            break;

                                        case 'update':
                                            $success = true;
                                            $result = [];
                                            try {
                                                $result['message_label'] = $this->getModel()->updateLobby($this->getLobbyId(), ['label_lobby' => $this->getRequest()->getLabel()])['message'];
                                                $success = $result['message_label']['success'];
                                            } catch (MissingParameterException $e) {
                                            }

                                            try {
                                                $result['message_description'] = $this->getModel()->updateLobby($this->getLobbyId(), ['description' => $this->getRequest()->getDescription()])['message'];
                                                if ($success) {
                                                    $success = $result['message_description']['success'];
                                                }
                                            } catch (MissingParameterException $e) {
                                            }

                                            try {
                                                $result['message_logo'] = $this->getModel()->updateLogo(
                                                    $this->getLobbyId(),
                                                    $this->getRequest()->getFile()['name'],
                                                    $this->getRequest()->getFile()['tmp_name'],
                                                    )['message'];
                                                if ($success) {
                                                    $success = $result['message_logo']['success'];
                                                }
                                                $result['path'] = $this->getRequest()->getFile()['name'];
                                            } catch (MissingParameterException $e) {
                                            }
                                            $result['success'] = $success;
                                            $this->setJSONResponse($result);
                                            break;

                                        case 'visibility':
                                            $this->setJSONResponse($this->getModel()->getVisibility($this->getLobbyId()));
                                            break;

                                        case 'delete':
                                            $this->setJSONResponse($this->getModel()->delete((int)$this->getRequest()->getParam()));
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
                        throw new RightException();
                    }
                }
                break;
        }
    }

    protected
    function handleException(InexistentLobbyException $exception): void
    {

    }
}
