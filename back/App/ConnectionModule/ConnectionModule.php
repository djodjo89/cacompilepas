<?php


namespace App\ConnectionModule;

require_once __DIR__ . '/../ConnectionModule/Controller/ConnectionController.php';
require_once __DIR__ . '/Model/ConnectionModel.php';
require_once __DIR__ . '/../Model/AbstractModel.php';
require_once __DIR__ . '/../Module/AbstractModule.php';

use App\Connection;
use App\ConnectionModule\Model\ConnectionModel;
use App\ConnectionModule\Controller\ConnectionController;
use App\Module\AbstractModule;

class ConnectionModule extends AbstractModule
{
    public function __construct(Connection $connection, array $params)
    {
        parent::setModel(new ConnectionModel($connection));
        parent::setController(new ConnectionController($this->getModel(), $params));
    }
}