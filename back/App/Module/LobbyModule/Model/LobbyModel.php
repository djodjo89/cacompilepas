<?php


namespace App\Module\LobbyModule\Model;

use App\Connection\Connection;
use App\Model\AbstractModel;


class LobbyModel extends AbstractModel
{

    public function __construct(Connection $connection)
    {
        parent::setConnection($connection);
    }

    public function getCourseSheets(int $idLobby): array
    {
        $stringQuery = 'SELECT title, publication_date, link, description
                        FROM ccp_coursesheet WHERE id_lobby_Contain = ?
                        ';
        $query = $this->getConnection()::$bdd->prepare($stringQuery);
        $query->execute([$email]);
        if ($result = $query->fetchAll()) {
            return $result;
        } else {
            return [];
        }
    }
}