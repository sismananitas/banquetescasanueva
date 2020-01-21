<?php

namespace App\Controllers;

class IndexController
{
    public function index() {
        $params = [];

        if (isset($_SESSION['error'])) {
            $params = [
                'error' => $_SESSION['error']
            ];
            unset($_SESSION['error']);
        }
        return view('index', $params);
    }
}