<?php

namespace App\Module\CourseSheetModule\Controller;

use App\Controller\AbstractController;
use App\Exception\JSONException;
use App\Exception\RightException;
use App\Http\JSONResponse;
use App\Module\CourseSheetModule\Exception\InexistentCourseSheetException;
use App\Module\CourseSheetModule\Model\CourseSheetModel;
use App\Module\CourseSheetModule\Model\MessageModel;
use App\Module\LobbyModule\Exception\InexistentLobbyException;
use App\Module\LobbyModule\Model\LobbyModel;

class CourseSheetController extends AbstractController
{
    public function __construct(CourseSheetModel $model)
    {
        parent::__construct($model);
        $this->setActions([
            'coursesheets',
            'add_hashtags',
            'remove_hashtag',
            'get_hashtags',
            'delete_course_sheet',
            'add_course_sheet',
        ]);
    }

    public function run(): void
    {
        $this->checkAction();
        try {
            $idLobby = $this->getModel()->getLobbyId($this->getRequest()->getParam());
        } catch (InexistentCourseSheetException | InexistentLobbyException $e) {
            new JSONException($e->getMessage());
        }
        $result = [];
        $this->checkRights($idLobby, $this->getRequest()->getToken());

        if ($this->visitorOrMore()) {
            switch ($this->getRequest()->getAction()) {
                case 'coursesheets':
                    $result = $this->getModel()->getCourseSheets($idLobby);
                    break;

                case 'get_hashtags':
                    $result = $this->getModel()->getHashtags($this->getRequest()->getParam());
                    break;

                case 'coursesheet':
                    $file = $this->getModel()->getFile((int)$idLobby, $this->getRequest()->getPath(), '/coursesheets/');
                    $this->downloadFile($file);
                    break;

                default:
                    if ($this->admin()) {
                        $this->checkToken();
                        switch ($this->getRequest()->getAction()) {
                            case 'add_hashtags':
                                $result = $this->getModel()->addHashtags($this->getRequest()->getParam(), $this->getRequest()->getHashtags());
                                break;

                            case 'remove_hashtag':
                                $result = $this->getModel()->removeHashtag($this->getRequest()->getParam(), $this->getRequest()->getHashtag());
                                break;

                            case 'add_course_sheet':
                                $requestHashtags = explode('&quot;', $this->getRequest()->getHashtags());
                                $hashtags = [];
                                foreach ($requestHashtags as $key => $value) {
                                    if (ctype_alnum($value)) {
                                        array_push($hashtags, $value);
                                    }
                                }
                                $result = (new CourseSheetModel($this->getModel()->getConnection()))->addCourseSheet(
                                    $idLobby,
                                    $this->getRequest()->getTitle(),
                                    $this->getRequest()->getFile()['name'],
                                    $this->getRequest()->getFile()['tmp_name'],
                                    $this->getRequest()->getDescription(),
                                    $hashtags,
                                    );
                                break;

                            case 'delete_course_sheet':
                                $result = $this->getModel()->deleteCourseSheet($idLobby, (int)$this->getRequest()->getParam());
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
        new JSONResponse($result);
    }
}