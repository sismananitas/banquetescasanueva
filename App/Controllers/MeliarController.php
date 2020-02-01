<?php

namespace App\Controllers;

class MeliarController extends Controller
{
    public function index() {
        $params = [
            'titulo' => 'Meliar'
        ];
        return view('index.index', $params);
    }
}