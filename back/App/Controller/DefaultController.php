<?php

namespace App\Controller;

use App\Connection\Connection;
use App\Module\ConnectionModule\ConnectionModule;
use App\Module\LobbyModule\LobbyModule;

class DefaultController
{
    private Connection $connection;
    private array $params = [];

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function fetchParamsFromRequest(array $requestMethod): array
    {
        foreach ($requestMethod as $key => $value)
            $this->params[$key] = $value;
        return $this->params;
    }

    public function redirect()
    {
        $this->fetchParamsFromRequest($_GET);
        $this->fetchParamsFromRequest($_POST);
        $this->fetchParamsFromRequest($_REQUEST);
        if (!is_null(json_decode(file_get_contents('php://input')))) {
            $this->fetchParamsFromRequest(json_decode(file_get_contents('php://input'), true));
        }
        if (isset($this->params['module'])) {
            switch ($this->params['module']) {
                case 'lobby':
                    $module = new LobbyModule($this->connection, $this->params);
                    $module->getController()->run();
                    break;

                case 'connection':
                    $module = new ConnectionModule($this->connection, $this->params);
                    $module->getController()->run();
                    if (isset($this->params['email']) && isset($this->params['password']) || isset($this->params['token']))
                        $module = new ConnectionModule($this->connection, $this->params);
                    break;

                default:
                    echo 'No valid module was provided';
                    break;
            }
        }
    }
}
