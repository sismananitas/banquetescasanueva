<?php

namespace App\Controllers;

class SistemaController extends Controller
{    
    public function index() {
        \Utils::isUser();
        return view('sistema.sistema');
    }
}