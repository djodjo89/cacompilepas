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

    public function fetchData(array $data, array $tabIfNotFound): array
    {
        if ($result = $data) {
            return $result;
        } else {
            return $tabIfNotFound;
        }
    }

    public function getLobbyById(int $idLobby): array
    {
        $stringQuery = 'SELECT label_lobby, description
                        FROM ccp_lobby
                        WHERE id_lobby = ?
                        ';
        $query = $this->getConnection()::$bdd->prepare($stringQuery);
        $query->execute([$idLobby]);
        return $this->fetchData($query->fetch(), []);
    }

    public function getCourseSheets(int $idLobby): array
    {
        $stringQuery = 'SELECT title, publication_date, link, description
                        FROM ccp_coursesheet 
                        WHERE id_lobby_Contain = ?
                        ';
        $query = $this->getConnection()::$bdd->prepare($stringQuery);
        $query->execute([$idLobby]);
        return $this->fetchData($query->fetchAll(), []);
    }

    public function getMessages(int $idLobby): array
    {
        $stringQuery = 'SELECT content, send_date, pseudo
                        FROM ccp_message
                        INNER JOIN ccp_user
                        USING(id_user)
                        WHERE id_lobby = ?
                        ';
        $query = $this->getConnection()::$bdd->prepare($stringQuery);
        $query->execute([$idLobby]);
        return $this->fetchData($query->fetchAll(), ['is_empty' => true]);
    }
}