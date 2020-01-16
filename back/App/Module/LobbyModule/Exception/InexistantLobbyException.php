<?php

namespace App\Module\LobbyModule\Exception;

use InexistentException;

class InexistentLobbyException extends InexistentException
{
    public function __construct()
    {
        parent::__construct('lobby');
    }
}