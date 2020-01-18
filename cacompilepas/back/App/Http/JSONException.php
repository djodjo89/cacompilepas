<?php

namespace App\Http;

class JSONException extends \Exception implements Response
{

    protected array $response;

    public function __construct(string $message = '')
    {
        parent::__construct($message);
        if ('' !== $message) {
            $this->response = [
                'success' => false,
                'message' => $message,
            ];
        } else {
            $this->response = [
                'success' => false,
            ];
        }
    }

    public function send(): void
    {
        echo json_encode($this->response);
        die();
    }
}