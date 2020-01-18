<?php

namespace App\Module\LobbyModule\Exception;

use App\Exception\InexistentException;

class InexistentLobbyException extends InexistentException
{
    public function __construct()
    {
        parent::__construct('lobby');
    }
}
