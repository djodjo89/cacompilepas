<?php
namespace App\Module;

require_once __DIR__ . '/../Connection/Connection.php';
require_once __DIR__ . '/../Model/AbstractModel.php';
require_once __DIR__ . '/../Controller/AbstractController.php';

use App\Connection;
use App\Model\AbstractModel;
use App\Controller\AbstractController;


abstract class AbstractModule
{
    private $model;
    private $controller;

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