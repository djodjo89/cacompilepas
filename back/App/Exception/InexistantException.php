<?php


abstract class InexistentException extends Exception
{
    public function __construct(string $type)
    {
        parent::__construct('That ' . $type . ' does not exist');
    }
}