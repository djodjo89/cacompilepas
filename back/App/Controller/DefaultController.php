<?php
namespace App\Controller;

require_once __DIR__ . '/../Connection/Connection.php';

use App\Connection;

class DefaultController
{
    private $connexion;

    public function __construct(Connection $connection)
    {
        $this->connexion = $connection;
    }

    public function redirect() {
        $params = fetchParamsFromRequest($_GET + $_POST);
        switch($params['module']) {
            case 'coursesheet':
                    $module = new CourseSheetModule($this->connexion, $params);
                break;

            case 'connection':
                if (isset($params['pseudo']) && isset($params['password']))
                    $module = new ConnectionModule($this->connexion, $params);
                break;

            default:
                throw new \Exception('No valid module was provided');
                break;
        }
        $module->getController()->run();
    }
    public function fetchParamsFromRequest(array $requestMethod): array
    {
        $params = [];
        foreach ($requestMethod as $key => $value)
            $params[$key] = $value;
        return $params;
    }
}