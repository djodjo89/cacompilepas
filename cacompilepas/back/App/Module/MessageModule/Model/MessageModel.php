<?php

namespace App\Module\MessageModule\Model;

use App\Http\JSONException;
use App\Model\AbstractModel;
use App\Module\LobbyModule\Exception\InexistentLobbyException;
use App\Module\MessageModule\Exception\InexistentMessageException;

class MessageModel extends AbstractModel
{

    public function getLobbyId(int $messageId): int
    {
        $this->sendQuery('
            SELECT id_message
            FROM ccp_message
            WHERE id_message = ?
        ',
            [$messageId]);

        if ($result = $this->getQuery()->fetch()) {
            $this->sendQuery('
            SELECT id_lobby
            FROM ccp_message
            WHERE id_message = ?
        ',
                [$messageId]);

            $result = $this->fetchData();

            if (0 !== count($result)) {
                return $result['data'][0]['id_lobby'];
            } else {
                throw new InexistentLobbyException();
            }
        } else {
            throw new InexistentMessageException();
        }
    }

    public function getMessages(int $lobbyId): array
    {
        $this->sendQuery('SELECT id_message, content, send_date, id_user, pseudo, icon
                        FROM ccp_message
                        INNER JOIN ccp_user
                        USING(id_user)
                        WHERE id_lobby = ?
                        ',
            [$lobbyId]);
        return $this->fetchData('Lobby does not contain any message');
    }

    public function addMessage(int $lobbyId, int $userId, string $content): array
    {
        $successfulInsert = $this->sendQuery('
            INSERT INTO ccp_message
            (content, send_date, id_user, id_lobby)
            VALUES 
            (?, NOW(), ?, ?)
        ',
            [$content, $userId, $lobbyId]);

        if ($successfulInsert) {
            return [
                'message' => 'Message was successfully added',
            ];
        } else {
            throw new JSONException('Message could not be added');
        }
    }

    public function deleteMessage(int $messageId): array
    {
        $this->sendQuery('
            SELECT id_message
            FROM ccp_message
            WHERE id_message = ?
        ',
            [$messageId]);

        if ($this->getQuery()->fetch()) {
            $successfulDelete = $this->sendQuery('
            DELETE 
            FROM ccp_message
            WHERE id_message = ?
        ',
                [$messageId]);

            if ($successfulDelete) {
                return [
                    'message' => 'Message was successfully deleted',
                ];
            } else {
                throw new JSONException('Message could not be deleted');
            }
        } else {
            throw new InexistentMessageException();
        }
    }
}
