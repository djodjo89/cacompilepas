<?php
namespace App\Connection;

use App\Http\JSONException;

if (!defined('CONST_INCLUDE'))
    die('Access Forbidden !');

class Connection
{
    public static $bdd;
    public static $ftp;
    
    public static function init()
    {
        self::$bdd = new \PDO('mysql:host=cacompilepas_db_1;port=3306;dbname=cacompilepasdb;', 'root', 'root') or die('Could not connect to database');
        self::$ftp = ftp_connect('cacompilepas_ftp_1') or die(new JSONException('Could not connect to ftp server'));
        ftp_login(self::$ftp, 'cacompilepas', 'cacompilepas');
    }
}
