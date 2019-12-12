<?php
namespace App\Model;

use App\Connection\Connection;

abstract class AbstractModel
{
    private Connection $connection;
    private \PDOStatement $query;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function getConnection(): Connection
    {
        return $this->connection;
    }

    public function setConnection(Connection $connection): void
    {
        $this->connection = $connection;
    }

    public function send_query(string $stringQuery, array $parameters): void
    {
        $this->query = $this->connection::$bdd->prepare($stringQuery);
        $this->query->execute($parameters);
    }

    public function getQuery(): \PDOStatement
    {
        return $this->query;
    }
}