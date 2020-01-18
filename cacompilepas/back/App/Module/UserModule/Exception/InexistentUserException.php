<?php

namespace App\Module\UserModule\Exception;

use App\Exception\InexistentException;

class InexistentUserException extends InexistentException
{
    public function __construct()
    {
        parent::__construct('user');
    }
}
