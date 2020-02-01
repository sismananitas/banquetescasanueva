<?php

namespace App\Controllers;

class VentasController extends Controller
{    
    public function index() {
        Utils::isAdmin();
        return view('ventas');
    }
}