<?php

namespace App\Controllers;

class AdminController {

    public function index() {
        \Utils::isAdmin();
        return view('admin');
    }
}