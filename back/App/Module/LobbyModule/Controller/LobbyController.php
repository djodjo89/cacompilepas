<?php


namespace App\Module\LobbyModule\Controller;

use App\Exception\NoIdProvidedException;
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
        try {

            if (isset($this->getParams()['action'])) {
                switch ($this->getParams()['action']) {
                    case 'coursesheets':
                        if (!isset($this->getParams()['param'])) {
                            throw new NoIdProvidedException('lobby');
                        }
                        $idLobby = (int)htmlspecialchars($this->getParams()['param']);
                        $courseSheets = $this->getModel()->getCourseSheets($idLobby);
                        echo json_encode($courseSheets);
                        break;
                    case 'messages':
                        if (!isset($this->getParams()['param'])) {
                            throw new NoIdProvidedException('lobby');
                        }
                        $idLobby = (int)htmlspecialchars($this->getParams()['param']);
                        $messages = $this->getModel()->getMessages($idLobby);
                        echo json_encode($messages);
                        break;
                    case 'lobby':
                        if (!isset($this->getParams()['param'])) {
                            throw new NoIdProvidedException('lobby');
                        }
                        $idLobby = (int)htmlspecialchars($this->getParams()['param']);
                        $lobby = $this->getModel()->getLobbyById($idLobby);
                        echo json_encode($lobby);
                        break;
                }
            }
        } catch (NoIdProvidedException $e) {
            echo $e->getMessage();
        }
    }
}