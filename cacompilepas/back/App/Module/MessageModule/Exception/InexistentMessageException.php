<?php

namespace App\Module\MessageModule\Exception;

use App\Exception\InexistentException;

class InexistentMessageException extends InexistentException
{
    public function __construct(string $type)
    {
        parent::__construct('message');
    }
}
