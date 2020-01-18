<?php


namespace App\Exception;


class IncorrectTokenException extends \Exception
{
    public function __construct()
    {
        parent::__construct('No token or an incorrect token was provided', 0, null);
    }
}