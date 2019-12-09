<?php
namespace App\Module;

use App\Connection\Connection;
use App\Model\AbstractModel;
use App\Controller\AbstractController;

abstract class AbstractModule
{
    private AbstractModel $model;
    private AbstractController $controller;

    abstract public function __construct(Connection $connection, array $params);

    public function getModel(): AbstractModel
    {
        return $this->model;
    }

    public function getController(): AbstractController
    {
        return $this->controller;
    }

    public function setModel(AbstractModel $model): void
    {
        $this->model = $model;
    }

    public function setController(AbstractController $controller): void
    {
        $this->controller = $controller;
    }
}