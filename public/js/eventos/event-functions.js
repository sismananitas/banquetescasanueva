
let nuevoEvento;
// TODO: ELIMINAR JQUERY
/** ABRE EL MODAL EVENTO */

function abrirEvent() {
	let body = document.getElementById('body');
	M_evento.style.display = 'block';
	body.setAttribute('style', 'overflow: hidden; padding-right: 17px');
}

/** CERRAR EL MODAL EVENTO */
function cerrarEvent() {
	form_evento.reset();
	M_evento.style.display = 'none';
	body.removeAttribute('style');
}

/** AGREGAR EVENTO */
function addEvento() {
	recolectarDatosGUI();
	if (personas.value === '') {
		popup.alert({ content: 'No el campo de personas debe ser de tipo numérico' })
		return 0;
	}
	if (nuevoEvento === '') {
		popup.alert({ content: 'La fecha de finalización no puede ser anterior a la fecha de inicio' })
		return 0;
	}
	openLoading();
	enviarInformacion('crear', nuevoEvento);
}

/** ELIMINAR EVENTO */
function eliminarEvento() {
	recolectarDatosGUI();
	openLoading();
	enviarInformacion('eliminar', nuevoEvento);
}

/** EDITAR EVENTO */
function modificarEvento() {
	recolectarDatosGUI();
	if (personas.value === '') {
		popup.alert({ content: 'No el campo de personas debe ser de tipo numérico' })
		return 0;
	}
	if (nuevoEvento === '') {
		popup.alert({ content: 'La fecha de finalización no puede ser anterior a la fecha de inicio' })
		return 0;
	}
	openLoading();
	enviarInformacion('editar', nuevoEvento);
}

/** CREAR OBJETO DE EVENTO */
function recolectarDatosGUI() {
	let start = date_start.value + ' ' + time.value,
		end = date_end.value + ' ' + time_f.value;

	if (start < end) {
		nuevoEvento = {
			id: e_id.value,
			title: e_title.value,
			evento: e_evento.value,
			contacto: e_contacto.value,
			cord_resp: e_cord_resp.value,
			cord_apoyo: e_cord_apoyo.value,
			description: e_description.value,
			id_lugar: idlugar.value,
			start: start,
			end: end,
			personas: personas.value,
			categoria: categoria.value,
			color: color.value,
			folio: e_folio.value
		}
	} else {
		nuevoEvento = '';
	}
}

/** MANDAR DATOS DEL EVENTO POR AJAX */
function enviarInformacion(accion, objEvento) {
	$.ajax({
		type: 'POST',
		url: 'eventos/' + accion,
		data: objEvento
		
	}).done((r) => {
		closeLoading();
		if (r.error) {
			popup.alert({ content: r.msg });
			return 0;
		} else {
			$('#calendar').fullCalendar('refetchEvents')
			cerrarEvent();
		}
	}).fail(() => {
		closeLoading();
		popup.alert({ content: 'No hay conexión a internet' })				
	})
}

function getIngreso(event) {
	let dataIng = new FormData;
	dataIng.append('evento_id', event.id_evento);

	ajaxRequest('eventos/get-ingreso', dataIng)
		.then(totales => {
			let val = totales.ingreso[0];

			if (parseFloat(val.total) > 0)
				return val.total;

			if (parseFloat(val.renta) > 0)
				return val.renta;

			return 0;
		})
		.then(ingreso => {
			let ingreso_format = parseFloat(ingreso).toLocaleString('es-MX', formato_moneda);
			e_ingreso.value = '$ ' + ingreso_format;
		})
}