<?php


namespace App\Module\LobbyModule\Model;

use App\Connection\Connection;
use App\Model\AbstractModel;
use App\Module\ConnectionModule\Model\ConnectionModel;
use Firebase\JWT\JWT;


class LobbyModel extends AbstractModel
{

    public function __construct(Connection $connection)
    {
        parent::setConnection($connection);
    }

    public function checkRights(int $idLobby, string $token): bool
    {
        $publicKey = file_get_contents(__DIR__ . '/../../../../keys/public_key.pem');
        $decoded = (array)JWT::decode($token, $publicKey, array('RS512'));

        $idUser = (new ConnectionModel($this->getConnection()))->verifyIfUserExists($decoded['email'], $decoded['password'])['id_user'];

        $stringQuery = 'SELECT read_right
                        FROM ccp_rights
                        WHERE id_user = ?
                        AND id_lobby_Protect = ?
                        ';
        $query = $this->getConnection()::$bdd->prepare($stringQuery);
        $query->execute([$idUser, $idLobby]);

        return $query->fetch()['read_right'] ? true : false;
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
        return $this->fetchData($query->fetch(), ['message' => 'Lobby ' . $idLobby . ' doesn\'t exist']);
    }

    public function getCourseSheets(int $idLobby): array
    {
        $stringQuery = 'SELECT title, publication_date, link, description
                        FROM ccp_coursesheet 
                        WHERE id_lobby_Contain = ?
                        ';
        $query = $this->getConnection()::$bdd->prepare($stringQuery);
        $query->execute([$idLobby]);
        return $this->fetchData($query->fetchAll(), ['message' => 'Lobby ' . $idLobby . ' doesn\'t contain any course sheet']);
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
        return $this->fetchData($query->fetchAll(), ['message' => 'Lobby ' . $idLobby . ' doesn\'t contain any message']);
    }
}