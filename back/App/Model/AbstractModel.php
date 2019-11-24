<?php
namespace App\Model;

require_once __DIR__ . '/../Connection/Connection.php';

use App\Connection;

abstract class AbstractModel
{
    private $connection;

    abstract public function __construct(Connection $connection);
    abstract public function getById(int $id);
    abstract public function deleteById(int $id): void;

    public function getConnection(): Connection
    {
        return $this->connection;
    }

    public function setConnection(Connection $connection): void
    {
        $this->connection = $connection;
    }
}