<?php


namespace App\Controller;

use App\Exception\JSONException;
use App\Http\Request;
use App\Model\AbstractModel;
use App\Module\ConnectionModule\Model\ConnectionModel;

abstract class AbstractController
{
    private AbstractModel $model;
    private Request $request;

    public function __construct(AbstractModel $model)
    {
        $this->setModel($model);
        $this->request = new Request;
    }

    abstract public function run(): void;

    public function getModel(): AbstractModel
    {
        return $this->model;
    }

    public function setModel(AbstractModel $model): void
    {
        $this->model = $model;
    }

    public function getRequest(): Request
    {
        return $this->request;
    }

    public function checkToken(): void
    {
        // Throws an exception if no token was provided or if token is incorrect
        if (!($connectionModel = new ConnectionModel($this->model->getConnection()))->checkToken($this->request->getToken())) {
            new JSONException('Incorrect or missing token');
        }
    }
}