<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

use chums\ui\CSSOptions;
use chums\ui\WebUI2;
use chums\user\Groups;

require_once("autoload.inc.php");

$ui = new WebUI2([
    'requiredRoles' => [Groups::CS, Groups::PRODUCTION],
    'title' => 'Shopify Orders',
    'bodyClassName' => 'container-fluid',
    "contentFile" => 'body.inc.php'
]);
$ui->addViteManifest()
    ->render();
