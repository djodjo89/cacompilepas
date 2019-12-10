<?php


namespace App\Exception;


class NoIdProvidedException extends \Exception
{
    public function __construct($type)
    {
        parent::__construct('No id was provided for ' . $type, 0, null);
    }
}