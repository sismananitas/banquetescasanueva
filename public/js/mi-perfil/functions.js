function obtenerDatosDonde(tabla, campo, valor) {
   let data = new FormData();
   data.append('tabla', tabla);
   data.append('campo', campo);
   data.append('valor', valor);

   return res = fetch('core/ajax/verRegistro.php', {
      method: 'POST',
      body: data
   })
   .then(response => response.json())
}