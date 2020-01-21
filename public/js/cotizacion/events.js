
/**--------------------- CLICK EN LA TABLA COTIZACION -------------*/
table_cotizacion.addEventListener('click', e => {
   let btnClass = e.target.className

   if (btnClass == 'btn primary') {
      modal_add_cot.style.display = 'block';
   }

   if (btnClass == 'btn atention') {
      let btnId = e.target.parentElement.parentElement.dataset.item
      location.href = 'cotizacion/detalle/' + btnId
   }

   if (btnClass == 'btn danger') {
      popup.confirm({
         content: '¿Está seguro de eliminar?',
         default_btns: {
            ok: 'SÍ', cancel: 'NO'
         }
      },
      (clck) => {
         if (clck.proceed) {
            alert('Eliminaste')
         }
      })
   }
})

/**----------------------- BOTÓN IMPRIMIR ----------------*/
// TODO: REPARAR EL FORMATO DE LA COTIZACIÓN */
btn_imprimir.addEventListener('click', e => {
   e.preventDefault()
   let folio = e.target.dataset.folio
   open('cotizacion/print/' + folio);
})

/**----------------------- BOTÓN ENVIAR -----------------*/

send_mail.addEventListener('click', () => {
   modal_correo.style.display = 'block'
})

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

/**------------ MODAL ADD COT -------------*/

modal_add_cot.addEventListener('click', e => {
   const m_bg = modal_add_cot.querySelector('.m-bg'),
      m_close = modal_add_cot.querySelector('.m-close');

   if (e.target == m_bg || e.target == m_close) {
      modal_add_cot.style.display = 'none';
      form_add_cot.reset();
   }
})

form_add_cot.addEventListener('submit', e => {
   e.stopPropagation();

   let dataCot = new FormData(form_add_cot);
   dataCot.append('evento_id', evento_id.value);

   ajaxRequest('cotizacion/add/manual', dataCot)
   .then(dataJson => {
      if (dataJson.error) {
         popup.alert({content: dataJson.msg});

      } else {
         popup.alert({content: 'Se registró la cotización'});
         body.removeAttribute('style');
         modal_add_cot.style.display = 'none';
         modal_info.style.display = 'none';
         form_add_cot.reset();
      }
   });
})
