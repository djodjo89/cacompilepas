<?php

namespace App\Module\CourseSheetModule\Controller;

use App\Controller\LinkedWithLobbyController;
use App\Exception\RightException;
use App\Http\FileResponse;
use App\Http\JSONException;
use App\Http\Request;
use App\Module\LobbyModule\Exception\InexistentLobbyException;
use App\Module\CourseSheetModule\Exception\InexistentCourseSheetException;
use App\Module\CourseSheetModule\Fetcher\CourseSheetFetcher;
use App\Module\CourseSheetModule\Model\CourseSheetModel;

class CourseSheetController extends LinkedWithLobbyController
{

    public function __construct(CourseSheetModel $model)
    {
        parent::__construct(
            $model,
            [
            'course_sheet',
            'course_sheets',
            'add_hashtags',
            'remove_hashtag',
            'get_hashtags',
            'delete_course_sheet',
            'add_course_sheet',
        ],
            new CourseSheetFetcher($model, new Request())
        );
    }

    protected function execute(): void
    {
        if ($this->visitorOrMore()) {
            switch ($this->getRequest()->getAction()) {
                case 'course_sheets':
                    $this->setJSONResponse($this->getModel()->getCourseSheets($this->getLobbyId()));
                    break;

                case 'get_hashtags':
                    $this->setJSONResponse($this->getModel()->getHashtags($this->getRequest()->getParam()));
                    break;

                case 'course_sheet':
                    try {
                        $file = $this->getModel()->getOnFTP((int)$this->getRequest()->getParam(), '/course_sheets/');
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

                            case 'add_course_sheet':
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

                            case 'delete_course_sheet':
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
}
