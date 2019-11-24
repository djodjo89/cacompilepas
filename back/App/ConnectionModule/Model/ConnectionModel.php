<?php


namespace App\ConnectionModule\Model;

require_once __DIR__ . '/../../Model/AbstractModel.php';

use App\Connection;
use App\Model\AbstractModel;

class ConnectionModel extends AbstractModel
{

    public function __construct(Connection $connection)
    {
        parent::setConnection($connection);
    }

    public function verifyIfUserExists(string $pseudo, string $password): bool
    {
        $stringQuery = 'SELECT id_user FROM user
                        WHERE pseudo = ?
                        AND password=?';
        $query = $this->getConnection()::$bdd->prepare($stringQuery);
        $query->execute([$pseudo, $password]);
        return false !== $query->fetch();
    }

    public function getById(int $id)
    {
        $stringQuery = 'SELECT user FROM user
                        WHERE id_user=?';
        $this->getConnection()->prepare($stringQuery);
        $this->getConnection()->execute([$id]);
        return $this->getConnection()->fetch();
    }

    public function deleteById(int $id): void
    {
        // TODO: Implement deleteById() method.
    }
}