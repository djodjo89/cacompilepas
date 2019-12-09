<?php


namespace App\Controller;

use App\Model\AbstractModel;

abstract class AbstractController
{
    private $model;
    private $params;

    abstract public function __construct(AbstractModel $model, array $params);
    abstract public function run(): void;

    public function getModel(): AbstractModel
    {
        return $this->model;
    }

    public function setModel(AbstractModel $model): void
    {
        $this->model = $model;
    }

    public function getParams(): array
    {
        return $this->params;
    }

    public function setParams(array $params): void
    {
        $this->params = $params;
    }
}