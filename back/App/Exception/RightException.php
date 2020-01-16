<?php


namespace App\Exception;


class RightException extends \Exception
{
    public function __construct()
    {
        parent::__construct('You do not have the right to do that');
    }
}