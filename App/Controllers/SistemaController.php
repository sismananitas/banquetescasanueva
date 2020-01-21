<?php

namespace App\Controllers;

class SistemaController {
    
    public function index() {
        \Utils::isUser();
        return view('sistema');
    }
}