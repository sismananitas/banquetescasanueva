
addEventListener('DOMContentLoaded', () => {

   let number = location.href;
   let cot = number.substr(number.length-1)

   /**-------------- CARGA LA TABLA DETALLE COTIZACIÓN -------------*/
   getFetch('get/' + cot)
   .then(dataJson => {
      if (dataJson.error) {
         popup.alert({content: dataJson.msg})
      } else {
         let cot = dataJson.cotizacion;
         let det = dataJson.detalle;
         let totales = dataJson.total;
         
         /** VARIFICA SI HAY COTIZACIONES */
         if (Object.keys(cot).length > 0) {
            pintarCotizacion(cot);
         }
         
         if (det.length > 0) {
            tbody_detalle_cot.innerHTML = pintarDetalle(det);
         }
         getTotales(totales);
      }
   })

   /**--------------- TABLA CARGAR COTIZACION ------------*/
   table_carga_cot.addEventListener('click', e => {
      let btnClass = e.target.className

      if (btnClass == 'btn primary') {
         let row = document.createElement('tr')
         row.innerHTML = `<td><input type="text" name="descripcion[]" placeholder="Descripcion" required></td>
         <td><input class="precio" type="number" name="precio[]" placeholder="0.00" step="0.01"></td>
         <td><input class="cantidad" type="number" name="cantidad[]" placeholder="0"></td>
         <td><input class="subtotal" type="text" name="subtotal[]" disabled value="0.00"></td>
         <td>
         <button class="btn danger" type="button"><i class="fas fa-times"></i></button>
         </td>`
         tbody_cargar_cot.appendChild(row)
      }

      if (btnClass == 'btn danger') {
         const d = e.target.parentElement.parentElement.parentElement
         e.target.parentElement.parentElement.remove()
         
         setTimeout(() => {
            let subtotales = form_carga_cot.querySelectorAll('.subtotal')
            
            getSubtotal(d)
            total_input.value = getTotal(subtotales)            
         }, 10)
      }
   })

   /**---------------- FORMULARIO CARGAR COTIZACION ----------*/

   form_carga_cot.addEventListener('submit', e => {
      e.preventDefault()
      const dataF = new FormData(form_carga_cot)
      dataF.append('folio', cot)

      ajaxRequest('post/insert', dataF)
         .then(dataJson => {
            if (dataJson.error) {
               popup.alert({content: dataJson.msg})
               
            } else {
               location.reload()
            }
         })
   })

   /**--------------- CARRITO DE COMPRA ----------------------*/

   tbody_cargar_cot.addEventListener('keyup', e => {
      const d = e.target.parentElement.parentElement
      let subtotal = tbody_cargar_cot.querySelectorAll('.subtotal')


      getSubtotal(d)
      total_input.value = getTotal(subtotal).toLocaleString('es-MX', formato_moneda)
      
   })
})

/**---------------- TABLA DETALLE COTIZACION ------------------*/

tbody_detalle_cot.addEventListener('click', e => {
   let btnClass = e.target.className
   detalle_id = e.target.parentElement.parentElement.dataset.item

   if (btnClass === 'btn danger') {
      popup.confirm({
         content: '<h3>Eliminar detalle</h3><br><p>¿Está seguro?</p>',
         default_btns: {
            ok: 'SÍ', cancel: 'NO'
         }
      },
      (ck) => {
         if (ck.proceed) {
            let dataDetalle = new FormData;
            dataDetalle.append('detalle_id', detalle_id)
      
            ajaxRequest('post/delete', dataDetalle)
            .then(dataJson => {
               if (dataJson.error) {
                  popup.alert({content: dataJson.msg})

               } else {
                  location.reload()
               }
            })
         }
      })
   }
})
