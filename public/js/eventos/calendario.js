
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
   dayClick: handlerDayClick,
   eventClick: handlerEventClick,
})

tabs('#tabs_ordenes')