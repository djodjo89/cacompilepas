<?php

namespace App\Fetcher;

use App\Exception\InexistentException;
use App\Exception\MissingParameterException;
use App\Http\Request;
use App\Model\AbstractModel;

abstract class AbstractFetcher
{

    private AbstractModel $model;
    private Request $request;

    public function __construct(AbstractModel $model, Request $request)
    {
        $this->model = $model;
        $this->request = $request;
    }

    public function fetch(): int
    {
        try {
            return $this->fetchFromParameters();
        } catch (MissingParameterException $exception) {
            return $this->handleMissingId($exception);
        } catch (InexistentException $exception) {
            return $this->handleInexistentLobby($exception);
        }
    }

    protected abstract function fetchFromParameters(): int;

    protected abstract function handleMissingId(\Exception $exception): int;

    protected abstract function handleInexistentLobby(\Exception $exception): int;

    public function getModel(): AbstractModel
    {
        return $this->model;
    }

    public function getRequest(): Request
    {
        return $this->request;
    }
}
