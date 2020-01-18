<?php

namespace App\Http;

class JSONResponse implements Response
{

    protected array $payload;

    public function __construct(array $params = [])
    {
        if ([] !== $params) {
            $this->payload = [
                'success' => true,
                'data' => isset($params['data']) ? $params['data'] : $params,
            ];
        } else {
            $this->payload = [
                'success' => true,
            ];
        }
    }

    public function send(): void
    {
        echo json_encode($this->payload);
        die();
    }
}
