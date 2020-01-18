<?php

namespace App\Module\MessageModule\Exception;

use App\Exception\InexistentException;

class InexistentMessageException extends InexistentException
{
    public function __construct()
    {
        parent::__construct('message');
    }
}
