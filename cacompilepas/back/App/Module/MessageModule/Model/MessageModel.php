<?php

namespace App\Module\MessageModule\Model;

use App\Http\JSONException;
use App\Model\AbstractModel;
use App\Module\MessageModule\Exception\InexistentMessageException;

class MessageModel extends AbstractModel
{

    public function getMessages(int $idLobby): array
    {
        $this->send_query('SELECT id_message, content, send_date, id_user, pseudo, icon
                        FROM ccp_message
                        INNER JOIN ccp_user
                        USING(id_user)
                        WHERE id_lobby = ?
                        ',
            [$idLobby]);
        return $this->fetchData('Lobby does not contain any message');
    }

    public function addMessage(int $idLobby, int $userId, string $content): array
    {
        $successfulInsert = $this->send_query('
            INSERT INTO ccp_message
            (content, send_date, id_user, id_lobby)
            VALUES 
            (?, NOW(), ?, ?)
        ',
            [$content, $userId, $idLobby]);

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
        $this->send_query('
            SELECT id_message
            FROM ccp_message
            WHERE id_message = ?
        ',
            [$messageId]);

        if ($this->getQuery()->fetch()) {
            $successfulDelete = $this->send_query('
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
