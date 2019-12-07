<?php


namespace App\Test\ConnectionModuleTest;

define ('CONST_INCLUDE', NULL);

use App\Connection\Connection;
use App\Module\ConnectionModule\Controller\ConnectionController;
use App\Module\ConnectionModule\Model\ConnectionModel;
use PHPUnit\Framework\TestCase;

class ConnectionModuleTest extends TestCase
{
    private Connection $connection;
    private ConnectionModel $connectionModel;

    /**
     * @before
     */
    public function setFixtures(): void
    {
        ($this->connection = new Connection())::init();
        $this->connectionModel = new ConnectionModel($this->connection);
        $this->connection::$bdd->query(
            'INSERT INTO ccp_user IF NOT EXISTS (id_user, email, password) VALUES (0, "tata@gmail.com", "tata")'
        );
    }

    /**
     * @after
     */
    public function deleteFixtures(): void
    {
        $this->connection::$bdd->query(
            'DELETE FROM ccp_user WHERE id_user=0'
        );
    }

    public function testLogin(): void
    {
        $this->assertTrue($this->connectionModel->verifyIfUserExists('tomtom', 'root'));
    }

    public function testGetById(): void
    {
        $this->assertTrue($this->connectionModel->getById(0));
    }
}