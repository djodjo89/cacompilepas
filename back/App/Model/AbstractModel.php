<?php

namespace App\Model;

use App\Connection\Connection;
use App\Exception\JSONException;
use App\Module\ConnectionModule\Model\ConnectionModel;
use Firebase\JWT\JWT;

abstract class AbstractModel
{
    private Connection $connection;
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

    public function send_query(string $stringQuery, array $parameters = []): bool
    {
        $this->query = $this->connection::$bdd->prepare($stringQuery);
        return $this->query->execute($parameters);
    }

    public function getQuery(): \PDOStatement
    {
        return $this->query;
    }

    public function extension(string $fileName): string
    {
        return explode('.', $fileName)[count(explode('.', $fileName)) - 1];
    }

    public function nameOnFTP(int $id, string $fileName, string $extension): string
    {
        return explode('.' . $extension, $fileName)[0] . "_$id" . '.' . $extension;
    }

    public function checkExtension(string $fileName, array $allowedExtensions): void
    {
        $extension = $this->extension($fileName);
        if (!in_array($extension, $allowedExtensions)) {
            new JSONException("$extension is not a proper file type");
        }
    }

    public function deleteOnFTP(string $fileName, string $directory): void
    {
        $serverDirectoryContent = ftp_nlist($this->connection::$ftp, $directory);
        if ($serverDirectoryContent && in_array($fileName, $serverDirectoryContent)) {
            ftp_delete($this->connection::$ftp, $fileName);
        }
    }

    public function uploadOnFTP(int $id, string $fileName, string $tmpName, string $uploadDirectory, array $allowedExtensions): array
    {
        $this->checkExtension($fileName, $allowedExtensions);
        // prepend '_$id' to file extension to differentiate
        // files with the same name
        $file = $this->nameOnFTP($id, $fileName, $this->extension($fileName));
        $newFileOnFTP = $uploadDirectory . $file;

        if (ftp_put($this->connection::$ftp, $newFileOnFTP, $tmpName, FTP_BINARY)) {
            return [
                'status' => 'success',
                'message' => "Successfully uploaded $fileName."
            ];
        } else {
            new JSONException("Could not upload $fileName");
        }
    }

    public function updateOnFTP(int $id, string $fileName, string $tmpName, array $allowedExtensions, string $uploadDirectory, string $oldFileName): array
    {
        $this->checkExtension($fileName, $allowedExtensions);
        // Delete old file on ftp server
        $oldFileNameOnFTPServer = $uploadDirectory . $this->nameOnFTP($id, $oldFileName, $this->extension($oldFileName));
        $this->deleteOnFTP($oldFileNameOnFTPServer, $uploadDirectory);

        return $this->uploadOnFTP($id, $fileName, $tmpName, $uploadDirectory, $allowedExtensions);
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

        $successfulUpdate = $this->send_query('
                        UPDATE ' . $table . '
                        SET ' . $params . '
                        WHERE ' . $idAttribute . ' = ?',
            [$id]
        );

        if ($successfulUpdate) {
            $count = 0;
            $result = [];
            foreach ($newData as $key => $value) {
                $result['message_' . $count] = "$model was successfully updated with '$value'";
                $count++;
            }

            return [
                'status' => 'success',
                'message' => $result,
            ];
        } else {
            new JSONException("An error occurred during $model update");
        }
    }

    public function fetchData(array $tabIfNotFound = []): array
    {
        if ($result = $this->getQuery()->fetchAll()) {
            return $result;
        } else {
            return $tabIfNotFound;
        }
    }

    public function arrayToIN(array $tab): array
    {
        return "'" . implode('\',\'', $tab) . "'";
    }
  
    public function getOnFTP(int $id, string $fileName, string $uploadDirectory): string
    {
        $file = $this->nameOnFTP($id, $fileName, $this->extension($fileName));
        if (ftp_get($this->connection::$ftp, '/tmp/' . $fileName, $uploadDirectory . $file, FTP_BINARY)) {
            return '/tmp/' . $fileName;
        } else {
            new JSONException('File could not be fetched');
        }
    }
}
