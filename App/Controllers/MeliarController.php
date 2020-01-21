<?php

namespace App\Controllers;

class MeliarController {

    public function index() {
        $params = [
            'titulo' => 'Meliar'
        ];
        return view('index', $params);
    }
}