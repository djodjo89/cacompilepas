<?php

namespace App\Module\ConnectionModule\Controller;

use App\Controller\AbstractController;
use App\Model\AbstractModel;

class ConnectionController extends AbstractController
{

    public function __construct(AbstractModel $model, array $params)
    {
        parent::setModel($model);
        parent::setParams($params);
    }

    public function run(): void
    {
        if (isset($this->getParams()['action'])) {
            switch ($this->getParams()['action']) {
                case 'login':
                    if (!isset($this->getParams()['email']) || !isset($this->getParams()['password'])) {
                        throw new \Exception('Email or password missing');
                    }
                    $email = htmlspecialchars($this->getParams()['email']);
                    $password = htmlspecialchars($this->getParams()['password']);

                    $idUser = $this->getModel()->verifyIfUserExists($email, $password);
                    if ($idUser) {
                        echo json_encode([
                            'token' => $this->getModel()->generateToken($email, $password, $idUser),
                            'connected' => true,
                        ]);
                    } else {
                        echo json_encode([
                            'connected' => false,
                        ]);
                    }
                    break;
                // Check if a token is valid
                case 'verification':
                    if (!isset($this->getParams()['token'])) {
                        throw new \Exception('No token was provided for connection');
                    }
                    $token = htmlspecialchars($this->getParams()['token']);
                    $token_exists = $this->getModel()->checkToken($token);
                    if ($token_exists) {
                        echo json_encode([
                            'token_exists' => true,
                        ]);
                    } else {
                        echo json_encode([
                            'token_exists' => false,
                        ]);
                    }
            }
        } else {
            throw new Exception('No action provided');
        }
    }
}
