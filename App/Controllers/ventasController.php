<?php

    class VentasController {
    
        public function index() {
            Utils::isAdmin();
            return view('ventas');
        }
    }