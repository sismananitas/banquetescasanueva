
function extraerDatosEvento(calEvent) {
	e_id.value = calEvent.id_evento
	e_title.innerHTML = calEvent.title
	e_evento.innerHTML = calEvent.evento
	e_contacto.innerHTML = calEvent.contacto
	e_cord_resp.innerHTML = calEvent.cord_resp
	e_cord_apoyo.innerHTML = calEvent.cord_apoyo
	e_description.innerHTML = calEvent.description
	let lugar = e_place;
	lugar.innerHTML = calEvent.lugar

	fechaHora = calEvent.start._i.split(" ")
	date.innerHTML = fechaHora[0]
	time.innerHTML = fechaHora[1]

	fechaHora_f = calEvent.end._i.split(" ")
	date_f.innerHTML = fechaHora_f[0]
	time_f.innerHTML = fechaHora_f[1]

	txtcategoria.innerHTML = calEvent.categoria;
	e_personas.innerHTML = calEvent.personas + ' PX';

	switch (calEvent.color) {
		case '#d7c735':
			e_status.innerHTML = 'TENTATIVO';
			break;

		case '#f98710':
			e_status.innerHTML = 'APARTADO';
			break;

		case '#54b33d':
			e_status.innerHTML = 'CERRADO';
	}
}

function limpiarDatosEvento(date) {
	form_evento.reset()
	e_title.innerHTML = ''
	e_evento.innerHTML = ''
	e_contacto.innerHTML = ''
	e_cord_resp.innerHTML = ''
	e_cord_apoyo.innerHTML = ''
	e_description.innerHTML = ''
	e_place.innerHTML = ''
	e_status.innerHTML = ''

	date.innerHTML = date.format()
	date_f.innerHTML = date.format()

	time.innerHTML = '00:00:00'
	time_f.innerHTML = '00:00:00'

	e_personas.innerHTML = '';
	txtcategoria.innerHTML = '';
	abrirEvent();
}
