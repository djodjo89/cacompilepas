<?php

namespace App\Module\MessageModule\Model;

use App\Model\AbstractModel;

class MessageModel extends AbstractModel
{
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
