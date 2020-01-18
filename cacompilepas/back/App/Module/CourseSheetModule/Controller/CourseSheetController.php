<?php

namespace App\Module\CourseSheetModule\Controller;

use App\Controller\LinkedWithLobbyController;
use App\Exception\RightException;
use App\Http\FileResponse;
use App\Http\JSONException;
use App\Module\LobbyModule\Exception\InexistentLobbyException;
use App\Module\CourseSheetModule\Exception\InexistentCourseSheetException;
use App\Module\CourseSheetModule\Fetcher\CourseSheetFetcher;
use App\Module\CourseSheetModule\Model\CourseSheetModel;

class CourseSheetController extends LinkedWithLobbyController
{

    public function __construct(CourseSheetModel $model)
    {
        parent::__construct($model);
        $this->setActions([
            'coursesheets',
            'add_hashtags',
            'remove_hashtag',
            'get_hashtags',
            'delete_coursesheet',
            'add_coursesheet',
        ]);
        $this->setFetcher(new CourseSheetFetcher($this->getModel(), $this->getRequest()));
    }

    protected function execute(): void
    {
        if ($this->visitorOrMore()) {
            switch ($this->getRequest()->getAction()) {
                case 'coursesheets':
                    $this->setJSONResponse($this->getModel()->getCourseSheets($this->getLobbyId()));
                    break;

                case 'get_hashtags':
                    $this->setJSONResponse($this->getModel()->getHashtags($this->getRequest()->getParam()));
                    break;

                case 'coursesheet':
                    try {
                        $file = $this->getModel()->getFile((int)$this->getRequest()->getParam(), '/coursesheets/');
                    } catch (InexistentCourseSheetException $e) {
                        $this->setResponse(new JSONException($e->getMessage()));
                    }
                    $this->setResponse(new FileResponse($file));
                    break;

                default:
                    if ($this->admin()) {
                        $this->checkToken();
                        switch ($this->getRequest()->getAction()) {
                            case 'add_hashtags':
                                $this->setJSONResponse($this->getModel()->addHashtags($this->getRequest()->getParam(), $this->getRequest()->getHashtags()));
                                break;

                            case 'remove_hashtag':
                                $this->setJSONResponse($this->getModel()->removeHashtag($this->getRequest()->getParam(), $this->getRequest()->getHashtag()));
                                break;

                            case 'add_coursesheet':
                                $requestHashtags = explode('&quot;', $this->getRequest()->getHashtags());
                                $hashtags = [];
                                foreach ($requestHashtags as $key => $value) {
                                    if (ctype_alnum($value)) {
                                        array_push($hashtags, $value);
                                    }
                                }
                                $this->setJSONResponse($this->getModel()->addCourseSheet(
                                    $this->getLobbyId(),
                                    $this->getRequest()->getTitle(),
                                    $this->getRequest()->getFile()['name'],
                                    $this->getRequest()->getFile()['tmp_name'],
                                    $this->getRequest()->getDescription(),
                                    $hashtags,
                                    )
                                );
                                break;

                            case 'delete_coursesheet':
                                $this->setJSONResponse($this->getModel()->deleteCourseSheet($this->getLobbyId(), (int)$this->getRequest()->getParam()));
                                break;

                            default:
                                throw new RightException();
                                break;
                        }
                    } else {
                        throw new RightException();
                    }
                    break;
            }
        } else {
            throw new RightException();
        }
    }

    protected function handleException(InexistentLobbyException $exception): void
    {
        throw new JSONException($exception);
    }
}
