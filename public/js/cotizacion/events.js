"use strict"

/**----------------------- BOTÓN IMPRIMIR ----------------*/
// TODO: REPARAR EL FORMATO DE LA COTIZACIÓN */
// btn_imprimir.addEventListener('click', e => {
//    e.preventDefault()
//    let folio = e.target.dataset.folio
//    open('cotizacion/print/' + folio);
// })

/**----------------------- BOTÓN AUTORIZAR -----------------*/
if (typeof btn_autorizar !== 'undefined') {
   btn_autorizar.addEventListener('click', () => {
      
      getFetch('cotizacion/get-by-event/' + evento_id.value)
      .then(dataJson => {
         let estado = dataJson.data[0].estado,
            folio   = dataJson.data[0].folio;

            form_status.querySelector('input[name=folio]').value = folio;
            
         if (estado == 'rechazada') {
            status_false.checked    = 'checked'
            send_mail.style.display = 'none'

         }
         if (estado == 'autorizada') {
            status_true.checked     = 'checked'
            send_mail.style.display = 'block'
         }
         if (estado == 'pendiente') {
            status_wait.checked   = 'checked'
            send_mail.style.display = 'none'
         }
      }).then(() => {
         modal_status.style.display = 'block';
      })
   })
}

/*-------------------- MODAL INFO ----------------------*/

modal_info.addEventListener('click', e => {
   const m_bg = modal_info.querySelector('.m-bg'),
      m_close = modal_info.querySelector('.m-close')

   if (e.target == m_bg || e.target == m_close) {
      body.removeAttribute('style');
      modal_info.style.display = 'none'
   }
})

/**------------------ MODAL STATUS --------------------*/
modal_status.addEventListener('click', e => {
   const m_bg = modal_status.querySelector('.m-bg'),
      m_close = modal_status.querySelector('.m-close');

   if (e.target == m_bg || e.target == m_close) {
      modal_status.style.display = 'none';
      form_status.reset();
   }
})

form_status.addEventListener('submit', e => {
   e.preventDefault();
   e.stopPropagation();
   
   let dataCot = new FormData(form_status);
   dataCot.append('evento_id', evento_id.value);

   ajaxRequest('cotizacion/status/update', dataCot)
   .then(dataJson => {
      if (dataJson.error) {
         throw dataJson;
      }
      form_status.reset();
      modal_status.style.display = 'none';
      modal_info.style.display = 'none';
   })
   .catch(error => popup.alert({ content: error.msg }));
})

/**------------- MODAL CORREOS --------------------*/

modal_correo.addEventListener('click', e => {
   const m_bg = modal_correo.querySelector('.m-bg'),
      m_close = modal_correo.querySelector('.m-close')

   if (e.target == m_bg || e.target == m_close) {
      modal_correo.style.display = 'none';
   }
})

// TODO: TERMINAR DE ARMAR EL MÓDULO DE CORREOS
form_email.addEventListener('submit', e => {
   e.stopPropagation()
   e.preventDefault()
   let mailData = new FormData(form_email);
   mailData.append('action', 'enviar_email')

   ajaxRequest('cotizacion', mailData)
   .then(dataJson => {
      if (dataJson.error) {
         popup.alert({content: dataJson.msg})
      }
      console.log(dataJson)
   })
})
