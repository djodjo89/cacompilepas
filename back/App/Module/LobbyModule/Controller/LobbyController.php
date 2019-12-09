<?php


namespace App\Module\LobbyModule\Controller;

use App\Controller\AbstractController;
use App\Model\AbstractModel;

class LobbyController extends AbstractController
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
                case 'coursesheets':
                    if (!isset($this->getParams()['id'])) {
                        throw new \Exception('No id provided for lobby');
                    }
                    $idLobby = (int)htmlspecialchars($this->getParams()['id']);
                    $courseSheets = $this->getModel()->getCourseSheets($idLobby);
                    echo json_encode($courseSheets);
            }
        }
    }
}