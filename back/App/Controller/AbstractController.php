<?php


namespace App\Controller;

use App\Exception\JSONException;
use App\Http\Request;
use App\Model\AbstractModel;
use App\Module\ConnectionModule\Model\ConnectionModel;
use App\Module\UserModule\Model\UserModel;

abstract class AbstractController
{
    private AbstractModel $model;
    private Request $request;
    private array $actions;
    private string $status;

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

    public function visitorOrMore(): bool
    {
        return in_array($this->status, ['user', 'visitor', 'admin']);
    }

    public function userOrMore(): bool
    {
        return in_array($this->status, ['user', 'admin']);
    }

    public function admin(): bool
    {
        return $this->status === 'admin';
    }

    public function checkRights(int $idLobby, string $token = ''): void
    {
        $decoded = (new UserModel($this->getModel()->getConnection()))->getUserFromToken($token);

        if ($result = (new UserModel($this->getModel()->getConnection()))->checkIfUserExists($decoded['email'], $decoded['password'])) {
            $isAdmin = (new UserModel($this->getModel()->getConnection()))->isAdmin((int)$result['id_user'], $idLobby);

            if ($isAdmin) {
                $this->status = 'admin';
            } else {
                $this->getModel()->send_query('
                    SELECT read_right, id_lobby
                    FROM ccp_rights
                    RIGHT OUTER JOIN ccp_lobby cl ON ccp_rights.id_lobby_Protect = cl.id_lobby
                    WHERE 
                    private = 0 OR
                    id_user = ?
                    AND id_lobby_protect = ?
                ',
                    [(int)$result['id_user'], $idLobby]);
                if ($result = $this->getModel()->getQuery()->fetch()) {
                    $this->status = 'user';
                } else {
                    $this->status = 'none';
                }
            }
        } else {
            $this->getModel()->send_query('
                    SELECT id_lobby
                    FROM ccp_lobby
                    WHERE id_lobby = ?
                    AND private = 0
                ',
                [$idLobby]);
            if ($result = $this->getModel()->getQuery()->fetch()) {
                $this->status = 'visitor';
            } else {
                $this->status = 'none';
            }
        }
    }
}
