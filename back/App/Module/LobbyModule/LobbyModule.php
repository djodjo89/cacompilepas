<?php


namespace App\Module\LobbyModule;

use App\Connection\Connection;
use App\Module\LobbyModule\Model\LobbyModel;
use App\Module\LobbyModule\Controller\LobbyController;
use App\Module\AbstractModule;

class LobbyModule extends AbstractModule
{
    public function __construct(Connection $connection, array $params)
    {
        parent::setModel(new LobbyModel($connection));
        parent::setController(new LobbyController($this->getModel()), $params);
    }
}