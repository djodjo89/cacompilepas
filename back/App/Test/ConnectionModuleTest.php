<?php


namespace App\Test\ConnectionModuleTest;

define('CONST_INCLUDE', NULL);

use PHPUnit\Framework\TestCase;

class ConnectionModuleTest extends TestCase
{
    public function testConnection(): void
    {
        $bdd = new \PDO('mysql:host=cacompilepas_db_1;port=3306;dbname=cacompilepasdb;', 'root', 'root');
        $query = $bdd->prepare('SELECT * FROM ccp_user');
        $query->execute();
    }
}
