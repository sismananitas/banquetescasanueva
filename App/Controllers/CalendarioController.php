<?php

namespace App\Controllers;

class CalendarioController extends Controller
{

    public function index() {
        \Utils::isUser();
        
        return view('calendario.calendario', ['view_url' => 'calendario']);
    }
}