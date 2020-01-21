
/** CARGA LOS DATOS EN EL FORMULARIO DE DETALLE */

function loadUserForm(userJson) {
   const d = document,
   name = d.querySelector('input[name="name"]'),
   last_name = d.querySelector('input[name="last-name"]'),
   email = d.querySelector('input[name="email"]'),
   number = d.querySelector('input[name="number"]');
   
   name.value = userJson.nombre;
   last_name.value = userJson.apellidos;
   email.value = userJson.correo;
   number.value = userJson.telefono;
}

/** CARGA LOS DATOS EN LA TABLA DE DETALLE */

function loadUserTable(userJson) {
   u_nombre.innerHTML = userJson.nombre;
   u_apellidos.innerHTML = userJson.apellidos;
   u_email.innerHTML = userJson.correo;
   u_telefono.innerHTML = userJson.telefono;
}