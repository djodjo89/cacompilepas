<?php

// Traitement erreur et sécurité
error_reporting(-1);
ini_set('display_errors', 'On');
set_error_handler("var_dump");
define ('CONST_INCLUDE', NULL);

require_once path(__DIR__ . '/../App/Connexion/Connexion.php');
require_once path(__DIR__ . '/../App/Controller/DefaultController.php');

use App\Connexion;
use App\Controller\DefaultController;

$connexion = new Connexion())::init();
$controller = new Controller($connexion);
$controller->redirect();

?>