addEventListener('DOMContentLoaded', () => {
   form_cotizacion.querySelectorAll('input')[1].focus();

   /** CARGA LOS LUGARES DISPONIBLES EN EL FORMULARIO */
   loadSelectLugares()

   /** CARGA LOS TIPOS DE EVENTOS EN EL FORMULARIO */
   loadSelectTiposEvento()

   /** ESCUCHA CUANDO EL FORMULARIO DE COTIZACIÓN */
   form_cotizacion.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();

      /** SE ALMACENAN LO DATOS DEL FORM */
      let userData = new FormData(form_cotizacion);

      if (d_init.value + ' ' + t_init.value > d_end.value + ' ' + t_end.value) {
         popup.alert({ content: 'La fecha final debe ser posterior a la fecha de inicio'});
         return 0;
      }

      /** COMPRUEBA LA DISPONIBILIDAD EN EL BACKEND */
      peticionAjax('cotizacion/comprobar-disp', userData)
      .then(dataJson => {
         if (dataJson.error) {
            popup.alert({ content: dataJson.msg });
            return 0;                  
         }

         /** PREGUNTA SI DESEA GUARDAR EL EVENTO */
         popup.confirm({
            content: dataJson.msg + '<br><br>¿Registrar evento?',
            default_btns: {
               ok: 'Sí', cancel: 'No'
            }
         },
         (clck) => {
            if (clck.proceed) {
               /** INSERTA EL EVENTO EN CASO DE SER CONFIRMADO */
               let dataEvento = new FormData(form_cotizacion);
               dataEvento.append('renta', dataJson.data)
               
               /** CARGA EL EVENTO EN LA BASE DE DATOS */
               insertEvent(dataEvento, dataJson)
               .then((response) => {
                  if (response.error) {
                     throw response.msg;
                  }
                  /** REGARGA EL CALENDARIO */
                  $('#calendar').fullCalendar('refetchEvents');
               })
               .catch(error => {
                  popup.alert({content: error})
               })
            }
         });
      })
   })
})
