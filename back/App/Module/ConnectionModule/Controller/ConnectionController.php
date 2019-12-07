<?php

namespace App\Module\ConnectionModule\Controller;

require_once __DIR__ . '/../../../Controller/AbstractController.php';

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
                    $email = htmlspecialchars($this->getParams()['email']);
                    $password = htmlspecialchars($this->getParams()['password']);

                    $id_user = $this->getModel()->verifyIfUserExists($email, $password);
                    if ($id_user) {
                        echo json_encode([
                            'token' => $this->getModel()->generateToken($email, $password, $id_user),
                            'connected' => true,
                        ]);
                    } else {
                        echo json_encode([
                            'connected' => false,
                        ]);
                    }
                    break;
            }
        } else {
            throw new Exception('No action provided');
        }
    }
}