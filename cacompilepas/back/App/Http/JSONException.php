<?php

namespace App\Http;

class JSONException extends \Exception implements Response
{

    protected array $payload;

    public function __construct(string $message = '')
    {
        parent::__construct($message);
        if ('' !== $message) {
            $this->payload = [
                'success' => false,
                'message' => $message,
            ];
        } else {
            $this->payload = [
                'success' => false,
            ];
        }
    }

    public function send(): void
    {
        echo json_encode($this->payload);
        die();
    }
}