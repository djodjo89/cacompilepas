<?php

namespace App\Module\CourseSheetModule\Fetcher;

use App\Fetcher\AbstractFetcher;
use App\Http\Request;
use App\Module\CourseSheetModule\Exception\InexistentCourseSheetException;
use App\Module\CourseSheetModule\Model\CourseSheetModel;
use App\Module\LobbyModule\Exception\InexistentLobbyException;

class CourseSheetFetcher extends AbstractFetcher
{

    public function __construct(CourseSheetModel $model, Request $request)
    {
        parent::__construct($model, $request);
    }

    protected function fetchFromParameters(): int
    {
        return $this->getModel()->getLobbyId($this->getRequest()->getParam());
    }

    protected function handleMissingId(\Exception $exception): int
    {
        return $this->getRequest()->getIdLobby();
    }

    protected function handleInexistentLobby(\Exception $exception): int
    {
        throw new InexistentCourseSheetException();
    }
}
