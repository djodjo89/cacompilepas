<?php

namespace App\Module\LobbyModule\Fetcher;

use App\Fetcher\AbstractFetcher;

class LobbyFetcher extends AbstractFetcher
{

    protected function fetchFromParameters(): int
    {
        return (int)$this->getRequest()->getParam();
    }

    protected function handleMissingId(\Exception $exception): int
    {
        return 0;
    }

    protected function handleInexistentLobby(\Exception $exception): int
    {
        return -1;
    }
}