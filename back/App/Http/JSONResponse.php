<?php

namespace App\Http;

class JSONResponse
{
    public function __construct(array $params = [])
    {
        echo json_encode($params);
    }
}