<?php

namespace App\Module\LobbyModule;

use App\Module\LobbyModule\Controller\LobbyController;
use App\Module\AbstractModule;

class LobbyModule extends AbstractModule
{
    public function __construct(LobbyController $controller)
    {
        parent::__construct($controller);
    }
}
