<?php
namespace App\Module;

use App\Controller\AbstractController;

abstract class AbstractModule
{
    private AbstractController $controller;

    public function __construct(AbstractController $controller)
    {
        $this->controller = $controller;
    }

    public function getController(): AbstractController
    {
        return $this->controller;
    }
}