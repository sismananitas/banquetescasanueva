
$('#calendar').fullCalendar({
   header: {
      left: 'listYear,month,agendaWeek',
      center: 'title',
      right: 'today, btnAgregar, prev,next'
   },
   views: {
      agendaWeek: {
         titleFormat: 'D MMM YYYY',
         columnHeaderFormat: 'ddd D'
      }
   },
   defaultView: 'month',
   eventLimit: true,
   allDaySlot: false,
   showNonCurrentDates: false,
   events: 'eventos/get-all',
   eventClick: function(calEvent, jsEvent, view) {
      const btnAddEvent = document.querySelector('#btnAgregarEvento');
      getIngreso(calEvent);

      /** ACTIVA Y DESACTIVA LOS BOTONES DEPENDIENDO DEL ESTADO DEL EVENTO */
      if (calEvent.color != '#e62424') {

         btnModificar.removeAttribute('disabled');
         btnBorrar.removeAttribute('disabled');
         btnDetalleEvento.removeAttribute('disabled');
         btnAddEvent.setAttribute('disabled', 'disabled');

      } else {
         btnModificar.removeAttribute('disabled');
         btnBorrar.setAttribute('disabled', 'disabled');
         btnDetalleEvento.removeAttribute('disabled');
         btnAddEvent.setAttribute('disabled', 'disabled');
      }

      if (calEvent.evento != null && view.name == 'month') {
         extraerDatosEvento(calEvent);
         abrirEvent();
      }
   },
   dayClick: function(date, jsEvent, view) {
      if (view.name == 'month') {

         obtenerLugares(idlugar);
         limpiarDatosEvento(date);
         btnBorrar.setAttribute('disabled', true);
         btnModificar.setAttribute('disabled', true);
         btnDetalleEvento.setAttribute('disabled', true);
         btnAgregarEvento.removeAttribute('disabled');
         
         M_evento.querySelectorAll('input')[1].focus();
         abrirEvent();
      }
   }
})

