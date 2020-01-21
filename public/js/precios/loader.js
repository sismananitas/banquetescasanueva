addEventListener('DOMContentLoaded', () => {
   const modal_precios = new Modal(m_precios);
   
   /** OBTIENE TODOS LOS PRECIOS */
   getFetch('precios/get-all')
   .then(dataJson => {
      tbody_precios.innerHTML = '';        
      let dataHTML = '';
      
      for (i in dataJson) {
         item = dataJson[i];
         let precio_alta = parseFloat(item.precio_alta).toLocaleString('es-MX', formato_moneda),
         precio_baja = parseFloat(item.precio_baja).toLocaleString('es-MX', formato_moneda);

         dataHTML += `<tr data-precio="${item.id}">
         <td>${item.lugar}</td> <td>${item.evento}</td> <td>$ ${precio_alta}</td> <td>$ ${precio_baja}</td>
         <td><button class="danger"><i class="fas fa-trash-alt"></i></button></td>
         </tr>`;
      }
      tbody_precios.innerHTML = dataHTML;
   })
   
   /** OBTIENE TODOS LOS LUGARES */
   getFetch('lugares/get-all')
   .then(dataJson => {
      select_lugar.innerHTML = '<option value="">- Elegir -</option>';
      let data = '';
      
      for (i in dataJson) {
         item = dataJson[i];
         
         data += `<option value="${item.id_lugar}">${item.lugar}</option>`;
      }
      select_lugar.innerHTML += data;
   })
   
   /** OBTIENE TODOS LOS TIPOS DE EVENTOS */
   getFetch('tipo-eventos/get-all')
   .then(dataJson => {
      select_t_evento.innerHTML = '<option value="">- Elegir -</option>';
      let data = '';
      
      for (i in dataJson) {
         item = dataJson[i];
         
         data += `<option value="${item.id_tipo_evento}">${item.nombre_tevento}</option>`;
      }
      select_t_evento.innerHTML += data;
   })
   
   window.addEventListener('click', (e) => {
      if (e.target === modal_precios.fondo || e.target === modal_precios.btn_close) {
         modal_precios.cerrar();
         form_precios.reset();

      }
      
      if (e.target === add_precio) {
         modal_precios.titulo.innerHTML = 'Agregar Precio';
         modal_precios.abrir();
      }

      if (e.target.className === 'danger') {
         popup.confirm({ content: 'Se borrará el registro' },
         (clck) => {
            if (clck.proceed) {
               id_e = e.target.parentElement.parentElement.dataset.precio;
               let formData = new FormData();
               formData.append('id_precio', id_e);
               
               peticionAjax('precios/delete', formData)
               .then(dataJson => {
                  if (dataJson.error) {
                     throw dataJson;
                  }
                  location.reload();
               })
               .catch(error => popup.alert({ content: error.msg }))
            }
         })
      }
   })
   
   form_precios.addEventListener('submit', (e) => {
      let formData = new FormData(form_precios);
      
      peticionAjax('precios/insert', formData)
      .then(dataJson => {
         if (dataJson.error) {
            popup.alert({ content: dataJson.msg})
         } else {
            location.reload();
         }
      })
   })

   // Barra de búsqueda
   searchBar('search', 'tbody_precios');
})