<?php


namespace App\Http;


class FileResponse implements Response
{
    private string $file;

    public function __construct(string $file)
    {
        $this->file = $file;
    }

    public function send(): void
    {
        if (file_exists($this->file)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="'.basename($this->file).'"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
            header('Content-Length: ' . filesize($this->file));
            readfile($this->file);
            exit;
        }
    }
}
