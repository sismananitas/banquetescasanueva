"use strict"
/** PINTA EL MODAL COTIZACIÓN */
function printModalCotizacion(dataCot) { 
   getFetch('usuarios/get-one/' + dataCot.id_usuario)
   .then(dataJson => {
      if (dataJson.error)
         throw 'No se encontró el vendedor'

      let user = dataJson[0]
      if (user.nombre == null || user.nombre == '') {
         usuario.innerHTML = user.username
      } else {
         usuario.innerHTML = user.nombre + ' ' + user.apellidos;
      }
   })
   .catch(err => {
      usuario.innerHTML = err
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
   let table_rows = ''
   let color      = 'background: #dbbb2f'
   let estado     = 'PENDIENTE'
   let total      = 0
   let tbody      = document.getElementById('tbody_cotizaciones')

   // Recorre todas las cotizaciones creadas
   for (let i in dataCot) {
      let cot     = dataCot[i]
      let dateObj = new Date(cot.fecha)
      let fecha   = (dateObj.getDate() + 1) + '/' + MESES[dateObj.getMonth()] + '/' + dateObj.getFullYear()
      
      if (cot.estado == 'pendiente') {
         estado = 'PENDIENTE'
         color  = 'background: #dbbb2f'
      }
      if (cot.estado == 'autorizada') {
         estado = 'AUTORIZADA'
         color  = 'background: green'
      }
      if (cot.estado == 'rechazada') {
         estado = 'NO AUTORIZADA'
         color  = 'background: red'
      }
      
      if (cot.total === null)
         cot.total = cot.renta

      renta = parseFloat(cot.renta).toLocaleString('es-MX', formato_moneda)
      total = parseFloat(cot.total).toLocaleString('es-MX', formato_moneda)
      
      table_rows += `<tr data-item="${ cot.folio }">
      <td>${ fecha }</td>
      <td>$ ${ renta }</td>
      <td>${ cot.usuario }</td>
      <td>$ ${ total }</td>
      <td style="${ color }; color:#fff">${ estado }</td>
      <td>
      <button class="btn atention" onclick="showDetailCot(${ cot.folio })">
      <i class="far fa-eye"></i>
      </button>
      </td>
      </tr>`
   }
   tbody.innerHTML = table_rows
}