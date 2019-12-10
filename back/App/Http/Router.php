<?php

namespace App\Http;

use App\Connection\Connection;
use App\Exception\JSONException;
use App\Exception\NoModuleProvidedException;
use App\Http\Request;
use App\Module\ConnectionModule\ConnectionModule;
use App\Module\ConnectionModule\Controller\ConnectionController;
use App\Module\ConnectionModule\Model\ConnectionModel;
use App\Module\LobbyModule\Controller\LobbyController;
use App\Module\LobbyModule\LobbyModule;
use App\Module\LobbyModule\Model\LobbyModel;

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
        $module = null;
        switch ($this->request->getModule()) {
            case 'lobby':
                $module = new LobbyModule(new LobbyController(new LobbyModel($this->connection)));
                break;

            case 'connection':
                $module = new ConnectionModule(new ConnectionController(new ConnectionModel($this->connection)));
                break;

            default:
                new JSONException($this->request->getModule() . ' module does not exist');
                break;
        }
        $module->getController()->run();
    }
}
