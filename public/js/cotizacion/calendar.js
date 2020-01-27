$('#calendar').fullCalendar({
   header: {
      left: 'month,agendaWeek,agendaDay',
      center: 'title',
      right: 'today, prev,next'
   },
   defaultView: 'month',
   allDaySlot: false,
   eventLimit: true,
   eventSources: [{
      url: 'eventos/get-all',
      type: 'GET',
      cache: false
   }],
   navLinks: true,
   nowIndicator: true,
   showNonCurrentDates: false,
   views: {
      agendaWeek: { // name of view
         titleFormat: 'D MMM YYYY',
         columnHeaderFormat: 'ddd D'
      }
   },
   dayClick: dayClickHandler,
   eventClick: eventClickHandler,
})