<?php

namespace App\Http;

use App\Connection\Connection;
use App\Exception\JSONException;
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

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
        $this->request = new Request();
    }

    public function redirect(): void
    {
        $controller = null;
        switch ($this->request->getModule()) {
            case 'lobby':
                $controller = new LobbyController(new LobbyModel($this->connection));
                break;

            case 'connection':
                $controller = new ConnectionController(new ConnectionModel($this->connection));
                break;

            case 'coursesheet':
                $controller = new CourseSheetController(new CourseSheetModel($this->connection));
                break;

            case 'message':
                $controller = new MessageController(new MessageModel($this->connection));
                break;

            case 'user':
                $controller = new UserController(new UserModel($this->connection));
                break;

            default:
                new JSONException($this->request->getModule() . ' module does not exist');
                break;
        }
        try {
            $controller->run();
        } catch (MissingParameterException | RightException $e) {
            new JSONException($e->getMessage());
        }
    }
}
