<?php


namespace App\Controller;

use App\Http\JSONException;
use App\Http\JSONResponse;
use App\Http\Request;
use App\Http\Response;
use App\Model\AbstractModel;
use App\Module\ConnectionModule\Model\ConnectionModel;
use App\Module\UserModule\Exception\InexistentUserException;
use App\Module\UserModule\Model\UserModel;

abstract class AbstractController
{

    private AbstractModel $model;
    private Request $request;
    private Response $response;
    private string $status;

    public function __construct(AbstractModel $model, array $actions)
    {
        $this->model = $model;
        $this->request = new Request();
        $this->checkAction($actions);
        $this->checkStatus();
    }

    abstract public function run(): void;

    public function getModel(): AbstractModel
    {
        return $this->model;
    }

    public function getRequest(): Request
    {
        return $this->request;
    }

    public function getResponse(): Response
    {
        return $this->response;
    }

    public function setResponse(Response $response): void
    {
        $this->response = $response;
    }

    public function setJSONResponse(array $payload): void
    {
        $this->response = new JSONResponse($payload);
    }

    public function checkToken(): void
    {
        // Throws an exception if no token was provided or if token is incorrect
        if (!(new ConnectionModel($this->model->getConnection()))->checkToken($this->request->getToken())) {
            throw new JSONException('Incorrect or missing token');
        }
    }

    public function setActions(array $actions): void
    {
        $this->actions = $actions;
    }

    public function checkAction(array $actions): void
    {
        if (!in_array($this->request->getAction(), $actions)) {
            throw new JSONException($this->getRequest()->getAction() . ' action does not exists');
        }
    }

    public function checkStatus(): void
    {
        $userModel = (new UserModel($this->getModel()->getConnection()));
        try {
            $decoded = $userModel->getUserFromToken($this->request->getToken());
            $userModel->checkIfUserExists($decoded['email'], $decoded['password']);
            if ((new ConnectionModel($this->getModel()->getConnection()))->checkToken($this->request->getToken())) {
                $this->status = 'connected';
            } else {
                $this->status = 'guest';
            }
        } catch (InexistentUserException $e) {
            $this->status = 'guest';
        }
    }

    public function connected(): bool
    {
        return 'connected' === $this->status;
    }
}
