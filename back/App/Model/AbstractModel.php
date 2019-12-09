<?php
namespace App\Model;

use App\Connection\Connection;

abstract class AbstractModel
{
    private Connection $connection;

    abstract public function __construct(Connection $connection);

    public function getConnection(): Connection
    {
        return $this->connection;
    }

    public function setConnection(Connection $connection): void
    {
        $this->connection = $connection;
    }
}