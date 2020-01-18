<?php

namespace App\Exception;

class IncompleteResponseException extends \Exception
{
    public function __construct()
    {
        parent::__construct('The response does not have any status');
    }
}