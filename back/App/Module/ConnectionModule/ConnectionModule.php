<?php

namespace App\Module\ConnectionModule;

use App\Connection\Connection;
use App\Module\ConnectionModule\Model\ConnectionModel;
use App\Module\ConnectionModule\Controller\ConnectionController;
use App\Module\AbstractModule;

class ConnectionModule extends AbstractModule
{
    public function __construct(Connection $connection, array $params)
    {
        parent::setModel(new ConnectionModel($connection));
        parent::setController(new ConnectionController($this->getModel(), $params));
    }
}