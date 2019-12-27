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
    private array $actions;

    public function __construct(AbstractModel $model)
    {
        $this->setModel($model);
        $this->request = new Request();
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
        if (!(new ConnectionModel($this->model->getConnection()))->checkToken($this->request->getToken())) {
            new JSONException('Incorrect or missing token');
        }
    }

    public function setActions(array $actions): void
    {
        $this->actions = $actions;
    }

    public function checkAction(): void
    {
        if (!in_array($this->request->getAction(), $this->actions)) {
            new JSONException($this->getRequest()->getAction() . ' action doesn\'t exists');
        }
    }

    public function downloadFile(string $file): void {
        if (file_exists($file)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="'.basename($file).'"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
            header('Content-Length: ' . filesize($file));
            readfile($file);
            exit;
        }
    }
}
