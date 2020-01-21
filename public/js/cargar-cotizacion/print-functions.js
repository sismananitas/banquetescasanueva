
function pintarDetalle(array) {
   let content = '';

   for (let i in array) {
      let item = array[i],
      // FORMATEO LOS DATOS DE MONEDA
      precio_unitario = parseFloat(item.precio_unitario).toLocaleString('es-MX', formato_moneda)
      subtotal = parseFloat(item.subtotal).toLocaleString('es-MX', formato_moneda)

      // CARGO MI CADENA CON LO DATOS
      content += `<tr data-item="${item.id}">
      <td>${item.descripcion}</td>
      <td class="moneda"><span>$</span> ${precio_unitario}</td>
      <td>${item.cantidad}</td>
      <td class="moneda"><span>$</span> ${subtotal}</td>
      <td><button class="btn danger"><i class="fas fa-trash-alt"></i></button></td></tr>`
   }
   return content
}

function pintarCotizacion(json) {
   let renta = parseFloat(json.renta).toLocaleString('es-MX', formato_moneda),
      format = new Date(json.fecha),
      fecha = (format.getDate() + 1)  + " de " + MESES[format.getMonth()] + " del " + format.getFullYear();

   // PINTO EL ELEMENTO CON LOS DATOS DE LA COTIZACIÓN
   data_evento.innerHTML = `<h3 style="margin-bottom: 5px">${json.evento}</h3>
   <p>Registró el ${fecha}</p>
   <p>Salón ${json.lugar}<p>
   <p>${json.pax} Personas</p>
   <p>Renta: $ ${renta} MXN</p>`

   t_renta.innerHTML = `<span>$</span> ${renta}`
   if (t_total.innerHTML == '') {
      t_total.innerHTML = `<span>$</span> ${renta}`
   }
}