<?php
namespace App\Connection;

if (!defined('CONST_INCLUDE'))
    die('Access Forbidden !');

class Connection
{
    
    public static $bdd;
    
    public static function init()
    {
        self::$bdd = new \PDO('mysql:host=cacompilepas_db_1;port=3306;dbname=cacompilepasdb;', 'root', 'root');
    }
}
