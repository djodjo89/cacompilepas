<?php

namespace App\Exception;

class IncorrectFileExtension extends \Exception
{
    public function __construct(string $extension)
    {
        parent::__construct("$extension is not a proper file type");
    }
}
