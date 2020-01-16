<?php

namespace App\Http;

use App\Exception\JSONException;
use App\Exception\MissingParameterException;

class Request
{

    public function __construct()
    {
        $this->fetchParamsFromRequest($_GET);
        $this->fetchParamsFromRequest($_POST);
        $this->fetchParamsFromRequest($_FILES);
        $this->fetchParamsFromRequest($_REQUEST);
        $this->fetchParamsFromRequest(getallheaders(), false);
        if (!is_null(json_decode(file_get_contents('php://input')))) {
            $this->fetchParamsFromRequest(json_decode(file_get_contents('php://input'), true));
        }
    }

    public function getToken(): string
    {
        if (isset($this->authorization)) {
            return explode(' ', $this->getAuthorization())[1];
        } else {
            return '';
        }
    }

    public function fetchParamsFromRequest(array $requestMethod, bool $checkIfInSnakeCase = true): void
    {
        foreach ($requestMethod as $key => $value) {
            if ($checkIfInSnakeCase) {
                $this->checkIfWrittenInSnakeCase($key);
            }
            if (is_array($value)) {
                $this->{$this->toCamelCase(htmlspecialchars($key))} = [];
                foreach ($value as $k => $val) {
                    $this->{$this->toCamelCase(htmlspecialchars($key))}[$k] = $val;
                }
            } else {
                $this->{$this->toCamelCase(htmlspecialchars($key))} = htmlspecialchars($value);
            }
        }
    }

    public function checkIfWrittenInSnakeCase(string $param): bool
    {
        if (0 !== strlen($param)) {
            $splittedParam = explode('_', $param);
            if (ctype_alnum($splittedParam[0]) && strtolower($splittedParam[0]) === $splittedParam[0]) {
                return $this->checkIfWrittenInSnakeCase(substr($param, strlen($splittedParam[0]) + (1 <= count($splittedParam) ? 1 : 0)));
            } else {
                new JSONException('Parameter is not written in snake case');
            }
        } else {
            return true;
        }
    }

    public function toCamelCase(string $param): string
    {
        $finalParam = '';
        $splitted = explode('_', $param);
        if (count($splitted) > 1 && strtoupper($splitted[0]) !== $splitted[0]) {
            foreach ($splitted as $index => $word) {
                $finalParam .= strtoupper(substr($word, 0, 1)) . strtolower(substr($word, 1, strlen($word) - 1));
            }
            $finalParam = strtolower(substr($finalParam, 0, 1)) . substr($finalParam, 1, strlen($finalParam));
        } else {
            $finalParam = strtolower(substr($param, 0, 1)) . substr($param, 1, strlen($param) - 1);
        }
        return $finalParam;
    }

    function __call($function, $parameters)
    {
        if ('get' === substr($function, 0, 3)) {
            $attributeName = $this->toCamelCase(substr($function, 3, strlen($function)));
            if (array_key_exists($attributeName, get_object_vars($this))) {
                return $this->{$attributeName};
            } else {
                throw new MissingParameterException($attributeName);
            }
        }
    }
}