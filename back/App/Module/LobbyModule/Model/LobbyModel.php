<?php


namespace App\Module\LobbyModule\Model;

use App\Connection\Connection;
use App\Model\AbstractModel;
use App\Module\ConnectionModule\Model\ConnectionModel;
use Firebase\JWT\JWT;


class LobbyModel extends AbstractModel
{
    public function checkRights(int $idLobby, string $token): bool
    {
        $publicKey = file_get_contents(__DIR__ . '/../../../../keys/public_key.pem');
        $decoded = (array)JWT::decode($token, $publicKey, array('RS512'));

        $idUser = (new ConnectionModel($this->getConnection()))->verifyIfUserExists($decoded['email'], $decoded['password'])['id_user'];

        $this->send_query('SELECT read_right
                        FROM ccp_rights
                        WHERE id_user = ?
                        AND id_lobby_Protect = ?
                        ',
                        [$idUser, $idLobby]);

        if ($result = $this->getQuery()->fetch()) {
            return $result['read_right'] ? true : false;
        } else {
            return false;
        }
    }

    public function fetchData(array $tabIfNotFound): array
    {
        if ($result = $this->getQuery()->fetchAll()) {
            return $result;
        } else {
            return $tabIfNotFound;
        }
    }

    public function getLobbyById(int $idLobby): array
    {
        $this->send_query('SELECT label_lobby, description
                        FROM ccp_lobby
                        WHERE id_lobby = ?
                        ',
                        [$idLobby]);
        return $this->fetchData(['message' => 'Lobby ' . $idLobby . ' doesn\'t exist']);
    }

    public function getCourseSheets(int $idLobby): array
    {
        $this->send_query('SELECT title, publication_date, link, description
                        FROM ccp_coursesheet 
                        WHERE id_lobby_Contain = ?
                        ',
                        [$idLobby]);
        return $this->fetchData(['message' => 'Lobby ' . $idLobby . ' doesn\'t contain any course sheet']);
    }

    public function getMessages(int $idLobby): array
    {
        $this->send_query('SELECT content, send_date, pseudo
                        FROM ccp_message
                        INNER JOIN ccp_user
                        USING(id_user)
                        WHERE id_lobby = ?
                        ',
                        [$idLobby]);
        return $this->fetchData(['message' => 'Lobby ' . $idLobby . ' doesn\'t contain any message']);
    }

    public function updateLobby(int $idLobby, array $newData): array
    {
        $count = 0;
        $params = '';

        foreach($newData as $key => $value) {
            $params .= " " . $key ." = '" . $value . "'";
            if ($count !== 0) {
                $params .= ', ';
            }
            $count++;
        }
        var_dump($params);
        echo '<br/><br/><br/>';
        $this->send_query('UPDATE ccp_lobby
                        SET ' . $params . '
                        WHERE id_lobby = ?
                        ',
                        [$idLobby]);

        return ['message' => 'Lobby label was updated'];
    }
/*
    public function updateLabel(int $idLobby, string $label): array
    {
        $this->send_query('UPDATE ccp_lobby
                        SET label_lobby = ?
                        WHERE id_lobby = ?
                        ',
                        [$label, $idLobby]);

        return ['message' => 'Lobby label was updated'];
    }

    public function updateDescription(int $idLobby, string $description): array
    {
        $oldDescription = $this->getLobbyById($idLobby);

        $this->send_query('UPDATE ccp_lobby
                        SET description = ?
                        WHERE id_lobby = ?
                            ',
                        [$description, $idLobby]);

        $newDescription = $this->
    }
*/
}