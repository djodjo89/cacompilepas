<?php

namespace App\Model;

use App\Exception\IncorrectFileExtension;
use App\Exception\JSONError;
use App\Http\JSONException;

abstract class AbstractFileModel extends AbstractModel
{
    public function nameOnFTP(int $id, string $fileName, string $extension): string
    {
        return explode('.' . $extension, $fileName)[0] . "_$id" . '.' . $extension;
    }

    public function checkExtension(string $fileName, array $allowedExtensions): void
    {
        $extension = $this->extension($fileName);
        if (!in_array($extension, $allowedExtensions)) {
            new IncorrectFileExtension($extension);
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

        if (!ftp_put($this->connection::$ftp, $newFileOnFTP, $tmpName, FTP_BINARY)) {
            new JSONException("Could not upload $fileName");
        } else {
            return [
                'success' => true,
                'message' => 'File was successfully uploaded',
            ];
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

    public function extension(string $fileName): string
    {
        return explode('.', $fileName)[count(explode('.', $fileName)) - 1];
    }

    public function getOnFTP(int $id, string $uploadDirectory): string
    {
        $fileName = $this->getPath($id);
        $file = $this->nameOnFTP($id, $fileName, $this->extension($fileName));
        // Temporarily suppress FTP warnings
        set_error_handler(function () {
        }, E_WARNING);
        dns_get_record('');
        if (ftp_get($this->connection::$ftp, '/tmp/' . $fileName, $uploadDirectory . $file, FTP_BINARY)) {
            return '/tmp/' . $fileName;
        } else {
            if (ftp_get($this->connection::$ftp, '/tmp/default_' . explode('/', $uploadDirectory)[1] . '.png', $uploadDirectory . 'default_' . explode('/', $uploadDirectory)[1] . '.png', FTP_BINARY)) {
                return '/tmp/default_' . explode('/', $uploadDirectory)[1] . '.png';
            } else {
                restore_error_handler();
                throw new JSONException('File could not be fetched');
            }
        }
    }

    public abstract function getPath(int $id): string;
}
