<?php

namespace App\Model;

use App\Connection\Connection;
use App\Http\JSONException;

abstract class AbstractModel
{
    protected Connection $connection;
    private \PDOStatement $query;
    static array $IMG_EXTENSIONS = ['jpg', 'jpeg', 'png', 'ico', 'svg'];
    static array $COURSE_SHEET_EXTENSIONS = ['pdf', 'docx', 'odp', 'txt', 'md', 'html', 'html'];

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function getConnection(): Connection
    {
        return $this->connection;
    }

    public function sendQuery(string $stringQuery, array $parameters = []): bool
    {
        $this->query = $this->connection::$bdd->prepare($stringQuery);
        return $this->query->execute($parameters);
    }

    public function getQuery(): \PDOStatement
    {
        return $this->query;
    }

    // Update only fields that are needed
    public function update(int $id, string $model, string $table, string $idAttribute, array $newData): array
    {
        $count = 0;
        $params = '';

        foreach ($newData as $key => $value) {
            $params .= ' ' . $key . " = '" . $value . "'";
            if ($count !== 0) {
                $params .= ', ';
            }
            $count++;
        }

        $successfulUpdate = $this->sendQuery('
                        UPDATE ' . $table . '
                        SET ' . $params . '
                        WHERE ' . $idAttribute . ' = ?',
            [$id]
        );

        if ($successfulUpdate) {
            $count = 0;
            $result = [];
            foreach ($newData as $key => $value) {
                $result['success'] = true;
                $result['message_' . $count] = "$model was successfully updated with '$value'";
                $count++;
            }

            return [
                'message' => $result,
            ];
        } else {
            throw new JSONException("An error occurred during $model update");
        }
    }

    public function fetchData(string $messageIfNotFound = ''): array
    {
        if ($result = $this->getQuery()->fetchAll()) {
            return [
                'data' => $result,
            ];
        } else {
            throw new JSONException($messageIfNotFound);
        }
    }

    public function arrayToIN(array $tab): array
    {
        return "'" . implode('\',\'', $tab) . "'";
    }
}
