<?php

namespace App\Module\ConnectionModule\Model;

use App\Connection\Connection;
use App\Model\AbstractModel;
use Firebase\JWT\JWT;

class ConnectionModel extends AbstractModel
{

    public function __construct(Connection $connection)
    {
        parent::setConnection($connection);
    }

    public function verifyIfUserExists(string $email, string $password): int
    {
        $stringQuery = 'SELECT id_user, password FROM ccp_user
                        WHERE email = ?
                        ';
        $query = $this->getConnection()::$bdd->prepare($stringQuery);
        $query->execute([$email]);
        if ($result = $query->fetch()) {
            if (password_verify($password, $result['password'])) {
                return $result['id_user'];
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    public function checkToken(string $token): bool
    {
        $stringQuery = 'SELECT token FROM ccp_token
                        WHERE token = ?
                        ';
        $query = $this->getConnection()::$bdd->prepare($stringQuery);
        $query->execute([$token]);
        if ($tokenExists = $query->fetch()) {
            // Update token last update date if it is valid
            $stringQuery = 'UPDATE ccp_token
                            SET last_update_date = NOW()
                            WHERE token = ?
                            ';
            $query = $this->getConnection()::$bdd->prepare($stringQuery);
            $query->execute([$token]);
            return true;
        } else {
            return false;
        }
    }

    public function generateToken(string $email, string $password, int $id_user): string
    {
        $stringQuery = 'SELECT token FROM ccp_token
                        WHERE id_user = ?
                        ';
        $query = $this->getConnection()::$bdd->prepare($stringQuery);
        $query->execute([$id_user]);
        $userAlreadyHasAToken = $query->fetch();
        if ($userAlreadyHasAToken) {
            return $userAlreadyHasAToken['token'];
        } else {
            $privateKey = file_get_contents(__DIR__ . '/../../../../keys/private_key.pem');
            $publicKey = file_get_contents(__DIR__ . '/../../../../keys/public_key.pem');

            $payload = array(
                'email' => $email,
                'pass' => $password,
                'time' => new \DateTime('NOW')
            );

            $jwt = JWT::encode($payload, $privateKey, 'RS512');

            $stringQuery = 'INSERT INTO ccp_token
                            (token, creation_date, last_update_date, id_user)
                            VALUES
                            (?, NOW(), NOW(), ?)
                            ';

            $query = $this->getConnection()::$bdd->prepare($stringQuery);
            $query->execute([$jwt, $id_user]);
        }

        return $jwt;
    }
}
