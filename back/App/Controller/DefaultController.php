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
        $params = fetchParamsFrom_GET();
        switch($_GET['module']) {
            case 'coursesheet':
                $courseSheetModule = new CourseSheetModule($this->connexion, $params);
                $courseSheetModule->getController()->run();
                break;
        }
    }
    public function fetchParamsFrom_GET(): array
    {
        $params = [];
        foreach ($_GET as $key => $value) {
            if ('module' !== $key)
                $params[$key] = $value;
        }
        return $params;
    }
}