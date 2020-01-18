<?php

namespace App\Http;

use App\Connection\Connection;
use App\Controller\AbstractController;
use App\Exception\InexistentException;
use App\Exception\MissingParameterException;
use App\Exception\RightException;
use App\Module\ConnectionModule\Controller\ConnectionController;
use App\Module\ConnectionModule\Model\ConnectionModel;
use App\Module\CourseSheetModule\Controller\CourseSheetController;
use App\Module\CourseSheetModule\Model\CourseSheetModel;
use App\Module\LobbyModule\Controller\LobbyController;
use App\Module\LobbyModule\Model\LobbyModel;
use App\Module\MessageModule\Controller\MessageController;
use App\Module\MessageModule\Model\MessageModel;
use App\Module\UserModule\Controller\UserController;
use App\Module\UserModule\Model\UserModel;

class Router
{
    private Connection $connection;
    private Request $request;
    private Response $response;
    private AbstractController $controller;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
        $this->request = new Request();
    }

    public function redirect(): void
    {
        switch ($this->request->getModule()) {
            case 'lobby':
                $this->controller = new LobbyController(new LobbyModel($this->connection));
                break;

            case 'connection':
                $this->controller = new ConnectionController(new ConnectionModel($this->connection));
                break;

            case 'coursesheet':
                $this->controller = new CourseSheetController(new CourseSheetModel($this->connection));
                break;

            case 'message':
                $this->controller = new MessageController(new MessageModel($this->connection));
                break;

            case 'user':
                $this->controller = new UserController(new UserModel($this->connection));
                break;

            default:
                $this->response = new JSONException($this->request->getModule() . ' module does not exist');
                break;
        }

        if (null !== $this->controller) {
            try {
                $this->controller->checkAction();
                $this->controller->run();
                $this->response = $this->controller->getResponse();
            } catch (MissingParameterException | RightException | InexistentException $e) {
                $this->response = new JSONException($e->getMessage());
            } catch (JSONException $e) {
                $this->response = $e;
            } catch (\Error $e) {
                $this->response = new JSONException($e->getMessage());
            }
        }

        $this->response->send();
    }
}
