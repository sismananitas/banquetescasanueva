<?php

namespace App\Controllers;

class CalendarioController {

    public function index() {
        \Utils::isUser();
        
        return view('calendario');
    }
}