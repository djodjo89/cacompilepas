<?php


namespace App\ConnectionModule\Controller;

require_once __DIR__ . '/../../Controller/AbstractController.php';

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
                    $pseudo = htmlspecialchars($this->getParams()['pseudo']);
                    $password = htmlspecialchars($this->getParams()['password']);

                    $userExists = $this->getModel()->verifyIfUserExists($pseudo, $password);
                    if ($userExists) {
                        echo json_encode([
                            'connected' => true
                        ]);
                    } else {
                        echo json_encode([
                            'connected' => false
                        ]);
                    }
                    break;
            }
        } else {
            throw new Exception('No action provided');
        }
    }
}