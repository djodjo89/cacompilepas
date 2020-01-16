<?php

namespace App\Module\MessageModule\Model;

use App\Model\AbstractModel;

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
        return $this->fetchData([
            'status' => 'fail',
            'message' => 'Lobby doesn\'t contain any message',
        ]);
    }

    public function addMessage(int $idLobby, int $idUser, string $content): array
    {
        $successfulInsert = $this->send_query('
            INSERT INTO ccp_message
            (content, send_date, id_user, id_lobby)
            VALUES 
            (?, NOW(), ?, ?)
        ',
            [$content, $idUser, $idLobby]);

        if ($successfulInsert) {
            return [
                'status' => 'success',
                'message' => 'Message was successfully added',
            ];
        } else {
            return [
                'status' => 'fail',
                'message' => 'Message could not be added',
                ];
        }
    }

    public function deleteMessage(int $idMessage): array
    {
        $successfulDelete = $this->send_query('
            DELETE FROM ccp_message
            WHERE id_message = ?
        ',
            [$idMessage]);

        if ($successfulDelete) {
            return [
                'status' => 'success',
                'message' => 'Message was successfully deleted',
            ];
        } else {
            return [
                'status' => 'fail',
                'message' => 'Message could not be deleted',
            ];
        }
    }
}
