<?php

namespace App\Module\ConnectionModule\Model;

use App\Connection\Connection;
use App\Model\AbstractModel;
use Firebase\JWT\JWT;

class ConnectionModel extends AbstractModel
{

    public function verifyIfUserExists(string $email, string $password): array
    {
        $this->send_query('SELECT id_user, password FROM ccp_user
                        WHERE email = ?
                        ',
                        [$email]);
        if ($result = $this->getQuery()->fetch()) {
            if ($password === $result['password'] || password_verify($password, $result['password'])) {
                return $result;
            }
        } else {
            return 0;
        }
    }

    public function checkToken(string $token): bool
    {
        $this->send_query('SELECT token FROM ccp_token
                        WHERE token = ?
                        ',
                        [$token]);
        if ($tokenExists = $this->getQuery()->fetch()) {
            // Update token last update date if it is valid
            $this->send_query('UPDATE ccp_token
                            SET last_update_date = NOW()
                            WHERE token = ?
                            ',
                            [$token]);
            return true;
        } else {
            return false;
        }
    }

    public function generateToken(string $email, string $password, int $id_user): string
    {
        $this->send_query('SELECT token FROM ccp_token
                        WHERE id_user = ?
                        ',
                        [$id_user]);
        $userAlreadyHasAToken = $query->fetch();
        if ($userAlreadyHasAToken) {
            return $userAlreadyHasAToken['token'];
        } else {
            $privateKey = file_get_contents(__DIR__ . '/../../../../keys/private_key.pem');

            $payload = array(
                'email' => $email,
                'password' => $this->verifyIfUserExists($email, $password)['password'],
                'time' => new \DateTime('NOW')
            );

            $jwt = JWT::encode($payload, $privateKey, 'RS512');

            $this->send_query('INSERT INTO ccp_token
                            (token, creation_date, last_update_date, id_user)
                            VALUES
                            (?, NOW(), NOW(), ?)
                            ',
                            [$jwt, $id_user]);
        }

        return $jwt;
    }
}
