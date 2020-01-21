
/** PINTA EL MODAL COTIZACIÓN */
function printModalCotizacion(dataCot) {
   
   getFetch('usuarios/get-one/' + dataCot.id_usuario)
   .then(dataJson => {
      if (dataJson.error) {
         return usuario.innerHTML = 'No se encontró el vendedor';
      }
      let user = dataJson[0]
      if (user.nombre == null || user.nombre == '') {
         usuario.innerHTML = user.username;
      } else {
         usuario.innerHTML = user.nombre + ' ' + user.apellidos;
      }
   })
   pax.innerHTML     = dataCot.personas + ' PAX'
   tipo.innerHTML    = dataCot.evento
   evento_id.value   = dataCot.id_evento
   lugar.innerHTML   = dataCot.lugar
   titulo.innerHTML  = dataCot.title
   cliente.innerHTML = dataCot.contacto
}

/** PINTA LA TABLA COTIZACIÓN */
function printTableCotizacion(dataCot) {
   table_rows = ''

   for (let i in dataCot) {
      cot    = dataCot[i];
      btn_imprimir.dataset.folio = cot.folio;
      f_formato              = new Date(cot.fecha);
      fecha = (f_formato.getDate() + 1) + '/' + MESES[f_formato.getMonth()] + '/' + f_formato.getFullYear();
      console.log(cot.estado);
      
      if (cot.estado == 'pendiente') {
         color  = 'background: #dbbb2f;';
         estado = 'PENDIENTE';
         send_mail.style.display = 'none';
      }
      if (cot.estado == 'autorizada') {
         estado = 'AUTORIZADA';
         color  = 'background: green';
         send_mail.style.display = 'block';
         
      }
      if (cot.estado == 'rechazada') {
         estado = 'NO AUTORIZADA';
         color  = 'background: red';
         send_mail.style.display = 'none';
      }
      
      if (cot.total === null)
      cot.total = cot.renta;

      renta = parseFloat(cot.renta).toLocaleString('es-MX', formato_moneda);
      total = parseFloat(cot.total).toLocaleString('es-MX', formato_moneda);
      
      table_rows += `<tr data-item="${cot.folio}">
      <td>${fecha}</td>
      <td>$ ${renta}</td>
      <td>${cot.usuario}</td>
      <td>$ ${total}</td>
      <td style="${color};color:#fff">${estado}</td><td>
      <button class="btn atention">
      <i class="far fa-eye"></i>
      </button></td></tr>`;
   }
   tbody_cotizaciones.innerHTML = table_rows
}