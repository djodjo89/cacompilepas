<?php

namespace App\Module\MessageModule;

use App\Module\AbstractModule;
use App\Module\MessageModule\Controller\MessageController;

class MessageModule extends AbstractModule
{
    public function __construct(MessageController $controller)
    {
        parent::__construct($controller);
    }
}
