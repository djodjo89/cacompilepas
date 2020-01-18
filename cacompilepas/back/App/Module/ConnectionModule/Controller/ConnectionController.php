<?php

namespace App\Module\ConnectionModule\Controller;

use App\Controller\AbstractController;
use App\Exception\IncorrectFileExtension;
use App\Exception\MissingParameterException;
use App\Http\JSONException;
use App\Http\JSONResponse;
use App\Model\AbstractModel;
use App\Module\UserModule\Model\UserModel;

class ConnectionController extends AbstractController
{
    public function __construct(AbstractModel $model)
    {
        parent::__construct(
            $model,
            [
                'login',
                'verification',
                'disconnect',
                'register',
            ]
        );
    }

    public function run(): void
    {
        switch ($this->getRequest()->getAction()) {
            case 'login':
                $this->setJSONResponse($this->getModel()->makeTokenIfUserExists($this->getRequest()->getEmail(), $this->getRequest()->getPassword()));
                break;

            // Check if a token is valid
            case 'verification':
                $token_exists = $this->getModel()->checkToken($this->getRequest()->getToken());
                $token_exists ? $this->setResponse(new JSONResponse()) : $this->setResponse(new JSONException());
                break;

            case 'disconnect':
                $this->checkToken();
                $email = (new UserModel($this->getModel()->getConnection()))->getUserFromToken($this->getRequest()->getToken())['email'];
                $this->setJSONResponse($this->getModel()->disconnect($email));
                break;

            case 'register':
                try {
                    try {
                        $file = $this->getRequest()->getFile();
                        $this->setJSONResponse($this->getModel()->register(
                            $this->getRequest()->getPseudo(),
                            $this->getRequest()->getFirstName(),
                            $this->getRequest()->getLastName(),
                            $this->getRequest()->getPassword(),
                            $this->getRequest()->getConfirmPassword(),
                            $this->getRequest()->getEmail(),
                            $file['name'],
                            $this->getRequest()->getFile()['tmp_name'],
                            )
                        );
                    } catch (MissingParameterException $e) {
                        $this->setJSONResponse($this->getModel()->register(
                            $this->getRequest()->getPseudo(),
                            $this->getRequest()->getFirstName(),
                            $this->getRequest()->getLastName(),
                            $this->getRequest()->getPassword(),
                            $this->getRequest()->getConfirmPassword(),
                            $this->getRequest()->getEmail(),
                            )
                        );
                    }
                } catch (IncorrectFileExtension $e) {
                    $this->setResponse(new JSONException($e->getMessage()));
                }
        }
    }
}
