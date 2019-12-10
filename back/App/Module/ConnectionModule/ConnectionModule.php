<?php

namespace App\Module\ConnectionModule;

use App\Module\ConnectionModule\Controller\ConnectionController;
use App\Module\AbstractModule;

class ConnectionModule extends AbstractModule
{
    public function __construct(ConnectionController $controller)
    {
        parent::__construct($controller);
    }
}
