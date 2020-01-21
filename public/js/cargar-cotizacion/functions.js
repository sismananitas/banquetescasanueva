
// TABLA DETALLE
function getTotales(totales) {
   alimentos = parseFloat(totales.alimentos).toLocaleString('es-MX', formato_moneda),
   total     = parseFloat(totales.total).toLocaleString('es-MX', formato_moneda);

   t_alimentos.innerHTML = '<span>$</span>' + alimentos;
   t_total.innerHTML = '<span>$</span>' + total;
}

// TABLA AGREGAR DETALLE
function getSubtotal(d) {
   let precio   = d.querySelector('.precio').value,
       cantidad = d.querySelector('.cantidad').value,
       subtotal = d.querySelector('.subtotal')

   result = precio * cantidad;
   subtotal.value = result.toLocaleString('en', formato_moneda);
}

function getTotal(subtotales) {   
   res = 0;
   for (let i = 0; i < subtotales.length; i++) {
      let subtotal = parseFloat(subtotales[i].value.replace(/,/g, ''));

      res += subtotal
   }
   return total_result = res;
}