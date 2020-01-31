<?php

namespace App\Controllers;

class Controller {
    protected function isPOST() {
        $response = false;

        if (empty($_POST)) {
            route(getenv('BASE_DIR'));
        }
        return $response;
    }

    protected function isGET() {
        $response = false;

        if (empty($_GET)) {
            route(getenv('BASE_DIR'));
        }
        return $response;
    }
}