<?php


namespace App\Test\ConnectionModuleTest;

define ('CONST_INCLUDE', NULL);

use App\Connection\Connection;
use App\Module\ConnectionModule\Model\ConnectionModel;
use PHPUnit\Framework\TestCase;

class ConnectionModuleTest extends TestCase
{
    public function testConnection(): void
    {
        /*($connection = new Connection())::init();
        $connectionModel = new ConnectionModel($connection);
        $connectionModel->send_query("
            SELECT id_user FROM ccp_user
            WHERE email LIKE 'tho%'
        ");
        $this->assertEquals(1, $connectionModel->getQuery()['id_user']);
        */
        $bdd = new \PDO('mysql:host=cacompilepas_db_1;port=3306;dbname=cacompilepasdb;', 'root', 'root');
        $query = $bdd->prepare('SELECT * FROM ccp_user');
        $query->execute();
        var_dump($query->fetch());
        }
}
