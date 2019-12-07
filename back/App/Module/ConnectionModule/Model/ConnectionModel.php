<?php

namespace App\Module\ConnectionModule\Model;

use App\Connection\Connection;
use App\Model\AbstractModel;
use Firebase\JWT\JWT;
use phpDocumentor\Reflection\Types\Integer;

class ConnectionModel extends AbstractModel
{

    public function __construct(Connection $connection)
    {
        parent::setConnection($connection);
    }

    public function verifyIfUserExists(string $email, string $password): int
    {
        $id_user = 0;
        $stringQuery = 'SELECT id_user FROM ccp_user
                        WHERE email = ?
                        AND password=?';
        $query = $this->getConnection()::$bdd->prepare($stringQuery);
        $query->execute([$email, $password]);
        if ($id_user = $query->fetch()['id_user']) {
            return $id_user;
        } else {
            throw new \Exception('User not found in database');
        }
    }

    public function generateToken(string $email, string $password, int $id_user): string
    {
        $privateKey = file_get_contents(__DIR__ . '/../../../../keys/private_key.pem');
        $publicKey = file_get_contents(__DIR__ . '/../../../../keys/public_key.pem');

        $payload = array(
            'email' => 'toto@gmail.com',
            'pass' => 'pass',
            'time' => new \DateTime('NOW')
        );

        $jwt = JWT::encode($payload, $privateKey, 'RS512');
        $decoded = JWT::decode($jwt, $publicKey, array('RS512'));

        $stringQuery = 'INSERT INTO ccp_token
                        (token, creation_date, last_update_date, id_user)
                        VALUES
                        (?, NOW(), NOW(), ?)
                        ';
        $query = $this->getConnection()::$bdd->prepare($stringQuery);
        $query->execute([$jwt, $id_user]);
        return $jwt;
    }
}