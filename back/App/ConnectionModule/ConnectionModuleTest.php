<?php


namespace App\ConnectionModule;

define ('CONST_INCLUDE', NULL);

require_once __DIR__ . '/../Connection/Connection.php';
require_once __DIR__ . '/ConnectionModule.php';

use App\Connection;
use App\ConnectionModule\Controller\ConnectionController;
use PHPUnit\Framework\TestCase;

class ConnectionModuleTest extends TestCase
{
    private $connection;
    private $connectionModel;

    /**
     * @before
     */
    public function setFixtures(): void
    {
        ($this->connection = new Connection())::init();
        $this->connectionModel = new ConnectionModel($this->connection);
        $this->connection::$bdd->query(
            'INSERT INTO user IF NOT EXISTS (id_user, pseudo, password) VALUES (0, "tata", "tata")'
        );
    }

    /**
     * @after
     */
    public function deleteFixtures(): void
    {
        $this->connection::$bdd->query(
            'DELETE FROM user WHERE id_user=0'
        );
    }

    public function testLogin(): void
    {
        $this->assertTrue($this->connectionModel->verifyIfUserExists('toto', 'pass'));
    }

    public function testGetById(): void
    {
        $this->assertTrue($this->connectionModel->getById(0));
    }
}