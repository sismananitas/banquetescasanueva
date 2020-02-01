<?php

namespace App\Controllers;

class IndexController extends Controller
{
    public function index() {
        $params = ['view_url' => 'index'];

        if (isset($_SESSION['error'])) {
            $params = [
                'error' => $_SESSION['error'],
            ];
            unset($_SESSION['error']);
        }
        return view('index.index', $params);
    }
}