<?php

namespace App\Http;

class JSONResponse implements Response
{

    protected array $response;

    public function __construct(array $params = [])
    {
        if ([] !== $params) {
            $this->response = [
                'success' => true,
                'data' => isset($params['data']) ? $params['data'] : $params,
            ];
        } else {
            $this->response = [
                'success' => true,
            ];
        }
    }

    public function send(): void
    {
        echo json_encode($this->response);
        die();
    }
}
