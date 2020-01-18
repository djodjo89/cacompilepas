<?php

namespace App\Controller;

use App\Fetcher\AbstractFetcher;
use App\Model\AbstractModel;
use App\Module\LobbyModule\Exception\InexistentLobbyException;
use App\Module\UserModule\Model\UserModel;

abstract class LinkedWithLobbyController extends AbstractController
{

    private int $lobbyId;
    private string $rightOnLobby;
    private AbstractFetcher $lobbyFetcher;

    public function __construct(AbstractModel $model, array $actions, AbstractFetcher $fetcher)
    {
        parent::__construct($model, $actions);
        $this->lobbyFetcher = $fetcher;
    }

    protected function getLobbyId(): int
    {
        return $this->lobbyId;
    }

    protected abstract function execute(): void;

    public function run(): void
    {
        $this->fetchLobbyId();
        $this->checkRightsOnLobby();
        $this->execute();
    }

    private function fetchLobbyId(): void
    {
        $this->lobbyId = $this->lobbyFetcher->fetch();
    }

    public function visitorOrMore(): bool
    {
        return in_array($this->rightOnLobby, ['user', 'visitor', 'admin']);
    }

    public function userOrMore(): bool
    {
        return in_array($this->rightOnLobby, ['user', 'admin']);
    }

    public function admin(): bool
    {
        return 'admin' === $this->rightOnLobby;
    }

    public function checkRightsOnLobby(): void
    {
        $this->getModel()->sendQuery('
            SELECT id_lobby
            FROM ccp_lobby
            WHERE id_lobby = ?
            AND private = 0
        ',
            [$this->lobbyId]);

        if ($result = $this->getModel()->getQuery()->fetch()) {
            $this->rightOnLobby = 'visitor';
        } else {
            $this->rightOnLobby = 'none';
        }

        if ($this->connected()) {
            $userModel = (new UserModel($this->getModel()->getConnection()));
            $userId = $userModel->userIdFromToken($this->getRequest()->getToken());
            $isAdmin = (new UserModel($this->getModel()->getConnection()))->isAdmin($userId, $this->lobbyId);

            if ($isAdmin) {
                $this->rightOnLobby = 'admin';
            } else {
                $this->getModel()->sendQuery('
                    SELECT read_right
                    FROM ccp_rights
                    RIGHT OUTER JOIN ccp_lobby cl ON ccp_rights.id_lobby_Protect = cl.id_lobby
                    WHERE private = 0 
                    OR (id_user = ?
                    AND id_lobby_protect = ?)
                ',
                    [$userId, $this->lobbyId]);
                if ($right = $this->getModel()->getQuery()->fetch()) {
                    if ($right['read_right']) {
                        $this->rightOnLobby = 'visitor';

                        $this->getModel()->sendQuery('
                        SELECT write_right
                        FROM ccp_rights
                        RIGHT OUTER JOIN ccp_lobby cl ON ccp_rights.id_lobby_Protect = cl.id_lobby
                        WHERE id_user = ?
                        AND id_lobby_protect = ?
                    ',
                            [$userId, $this->lobbyId]);

                        if ($right = $this->getModel()->getQuery()->fetch()) {
                            if ($right['write_right']) {
                                $this->rightOnLobby = 'user';
                            }
                        }
                    }
                } else {
                    $this->rightOnLobby = 'none';
                }
            }
        }
    }
}
