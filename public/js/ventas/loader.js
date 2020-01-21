sellyear = 2019;
cargarVentaSem1();
sellYear.innerHTML = sellyear;

addEventListener('DOMContentLoaded', () => {

   window.addEventListener('click', e => {

      /** CAMBIA EL AÑO EN LAS GRAFICAS */
      switch (e.target.classList[0]) {
         case 'nextyear':
         sellyear++;
         sellYear.innerHTML = sellyear;
         cargarVentaSem1();
         break;

         case 'prevyear':
         sellyear--;
         sellYear.innerHTML = sellyear;
         cargarVentaSem1();
         break;
      }
   })

   /** OBTIENE LOS CLIENTES COLECTADOS DE LA DB */
   obtenerDatos('cot_renta')
   .then(dataJson => {
      let rowHTML = '';

      if (dataJson.length) {
         for (let i in dataJson) {
            rowHTML += `<tr>
            <td>${dataJson[i].cliente}</td>
            <td>${dataJson[i].email}</td>
            <td>${dataJson[i].telefono}</td>
            </tr>`;
         }
      } else {
         rowHTML += `<tr>
         <td colspan="3">No hay clientes almacenados</td>
         </tr>`;
      }
      tbody_client.innerHTML = rowHTML;
   })

   obtenerDatos('usuarios')
   .then(dataJson => {
      if (dataJson.length) {

         for (let i in dataJson) {
            text = ''
            obtenerDatosDonde('eventos', 'id_usuario', dataJson[i].id_usuario)
            .then(dataVentas => {
               text += `<tr>
               <td>${dataJson[i].id_usuario}</td>
               <td>${dataJson[i].username}</td>
               <td>${dataVentas.length}</td>
               </tr>`;

               tbody_personal.innerHTML = text;
            })
         }

      } else {
         text += `<tr>
         <td colspan="3">No hay Personal de ventas registrado</td>
         </tr>`;
         tbody_personal.innerHTML = text;
      }
      //tbody_client.innerHTML = rowHTML;
   })

   obtenerDatosOrden('eventos', 'id_usuario')
   .then(dataJson => {
      for (let i in dataJson) {
      }
   })
})