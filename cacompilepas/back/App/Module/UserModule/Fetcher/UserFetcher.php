<?php

namespace App\Module\UserModule\Fetcher;

use App\Fetcher\AbstractFetcher;
use App\Http\Request;
use App\Module\UserModule\Exception\InexistentUserException;
use App\Module\UserModule\Model\UserModel;

class UserFetcher extends AbstractFetcher
{

    public function __construct(UserModel $model, Request $request)
    {
        parent::__construct($model, $request);
    }

    protected function fetchFromParameters(): int
    {
        return $this->getRequest()->getLobbyId();
    }

    protected function handleMissingId(\Exception $exception): int
    {
        return -1;
    }

    protected function handleInexistentLobby(\Exception $exception): int
    {
        throw new InexistentUserException();
    }
}