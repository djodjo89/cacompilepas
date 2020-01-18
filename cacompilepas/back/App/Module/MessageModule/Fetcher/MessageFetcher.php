<?php

namespace App\Module\MessageModule\Fetcher;

use App\Fetcher\AbstractFetcher;
use App\Http\Request;
use App\Module\MessageModule\Model\MessageModel;

class MessageFetcher extends AbstractFetcher
{

    public function __construct(MessageModel $model, Request $request)
    {
        parent::__construct($model, $request);
    }

    protected function fetchFromParameters(): int
    {
        return $this->getModel()->getLobbyId($this->getRequest()->getParam());
    }

    protected function handleMissingId(\Exception $exception): int
    {
        return $this->getRequest()->getLobbyId();
    }

    protected function handleInexistentLobby(\Exception $exception): int
    {
        return $this->getRequest()->getLobbyId();
    }
}