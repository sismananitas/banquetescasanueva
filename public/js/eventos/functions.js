"use strict"
// TODO: ELIMINAR JQUERY

let nuevoEvento
let errors = {}

/**
 * Fullcalendar
 */
function handlerDayClick(date, jsEvent, view) {
	if (view.name == 'month') {

		obtenerLugares(idlugar)
		limpiarDatosEvento(date)
		btnBorrar.setAttribute('disabled', true)
		btnModificar.setAttribute('disabled', true)
		btnDetalleEvento.setAttribute('disabled', true)
		btnAgregarEvento.removeAttribute('disabled')
		
		M_evento.querySelectorAll('input')[1].focus()
		openModal('M_evento');
	}
}

function handlerEventClick(calEvent, jsEvent, view) {
	const btnAddEvent = document.querySelector('#btnAgregarEvento')
	getIngreso(calEvent);

	/** ACTIVA Y DESACTIVA LOS BOTONES DEPENDIENDO DEL ESTADO DEL EVENTO */
	if (calEvent.color != '#e62424') {

		btnModificar.removeAttribute('disabled')
		btnBorrar.removeAttribute('disabled')
		btnDetalleEvento.removeAttribute('disabled')
		btnAddEvent.setAttribute('disabled', 'disabled')

	} else {
		btnModificar.removeAttribute('disabled')
		btnBorrar.setAttribute('disabled', 'disabled')
		btnDetalleEvento.removeAttribute('disabled')
		btnAddEvent.setAttribute('disabled', 'disabled')
	}

	if (calEvent.evento != null && view.name == 'month') {
		printModalEvento(calEvent)
		openModal('M_evento')
	}
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
	enviarInformacion('crear', nuevoEvento)
}

/** ELIMINAR EVENTO */
function eliminarEvento() {
	recolectarDatosGUI();
	openLoading();
	enviarInformacion('eliminar', nuevoEvento)
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
	enviarInformacion('editar', nuevoEvento)
}

/** CREAR OBJETO DE EVENTO */
function recolectarDatosGUI() {
	let start = date_start.value + ' ' + time.value,
		end = date_end.value + ' ' + time_f.value

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
		
	})
	.done((r) => {
		closeLoading()
		$('#calendar').fullCalendar('refetchEvents')
		cerrarModal('', 'M_evento')
	})
	.fail(err => {
		closeLoading()
		if (err.status == 401) {
			swal.fire({
				icon: 'error',
				title: err.responseJSON.data.message
			})
		}
		if (err.status == 422) {
			let textHtml = ''
			for (let i in err.responseJSON.data.errors) {
				textHtml += err.responseJSON.data.errors[i]
			}
			swal.fire({
				icon: 'error',
				title: err.responseJSON.data.message,
				html: textHtml
			})
		}
	})
}

function editarEvento() {
	popup.confirm({
		content: '<b>Modificar</b><br><br>¿Aplicar cambios?',
		default_btns: {
			ok: 'SÍ',
			cancel: 'NO'
		}
	},
	(click) => {
		if (click.proceed) {
			modificarEvento();
		}
	})
}

function destroyEvento() {
	popup.confirm({
		content: '<strong>Eliminar</strong><br><br>¿Está seguro?',
		default_btns: {
			ok: 'SÍ',
			cancel: 'NO'
		}
	},
	(click) => {
		if (click.proceed) {
			eliminarEvento();
		}
	})
}

function getIngreso(event) {
	let dataIng = new FormData;
	dataIng.append('evento_id', event.id_evento)

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
		let ingreso_format = parseFloat(ingreso).toLocaleString('es-MX', formato_moneda)
		e_ingreso.value = '$ ' + ingreso_format;
	})
}

function getTipoEventos() {

	getFetch('tipo-eventos/get-all')
	.then(dataJson => {
		text = `<option value="${dataJson[0].nombre_tevento}">- Elegir -</option>`

		for (i in dataJson) {
			t = dataJson[i];
			text += `<option value="${t.nombre_tevento}">${t.nombre_tevento}</option>`
		}
		e_evento.innerHTML = text;
	})
}

function obtenerLugares(select) {
	select.innerHTML = '';

	fetch('lugares/todos', {
		method: 'get'
	}).then(response => response.json())
	.then(dataJson => {
		let rowHTML = `<option value="${dataJson[0].id_lugar}"> - Elegir - </option>`

		if (dataJson != 'fail') {
			for (let i in dataJson) {
				let item = dataJson[i]

				rowHTML += `<option value="${item.id_lugar}"> ${item.lugar} </option>`
			}            
		} else {
			rowHTML = `<option value="2"> No se han registrado lugares </option>`
		}
		select.innerHTML = rowHTML
	})
	.catch(error => {
		console.log(`Surgió un error: ${error.message}`)
	})
}

function destroyLogistica(logisticaId) {
	popup.confirm({
		content: '<strong>Eliminar</strong><br><br>¿Está seguro?',
		default_btns: {
			ok: 'SÍ',
			cancel: 'NO'
		}
	},
	(click) => {
		if (click.proceed) {
			deleteLogistica(logisticaId)
		}
	})
}

/**---- ELIMINAR LOGÍSTICA ----*/
function deleteLogistica(logisticaId) {
	let logDatos = new FormData()

	logDatos.append('accion', 'eliminar')
	logDatos.append('id_evento', e_id.value)
	logDatos.append('id', logisticaId)

	openLoading()

	fetch('logistica/del', {
		method: 'POST',
		body: logDatos
	})
	.then(response => response.json())
	.catch(error => popup.alert({ content: 'No hay conexión a Internet' }))
	.then(dataJson => {
		if (dataJson.error) {
			throw dataJson;
		}

		/** ACTUALIZA LAS ACTIVIDADES */
		$('#calendar').fullCalendar('refetchEvents');
		let log = new FormData();

		log.append('id', id_evento.value)
		getLogistica(log)
		.then(() => closeLoading())
	})
	.catch(error => {
		swal.fire({
			type: 'error',
			title: error.msg
		})
	})
}

/**-----------------ABRE MODAL DETALLE EVENTO ----------------*/
async function abrirDetalleEvento() {
	let modal = document.getElementById('MD_evento')
	let id_evento = e_id.value
	let data = new FormData()

	data.append('id', id_evento) // Se agrega el id del evento clickeado

	// Muestra los datos en el formulario
	openLoading()
	await getLogistica(data)

	getOrdenes(data)
	.then(() => {
		closeLoading()
		modal.style.display = 'block'
	})
}

function getLogistica(data) {
	return peticionAjax('eventos/logistica', data)
	.then(dataJson => {
		if (dataJson.length > 0) {
			tb_logistica.innerHTML = mostrarLogistica(dataJson)
		} else {
			tb_logistica.innerHTML = ''
		}
	})
}

/**----------------- OBTENER ORDENES DE SERVICIO ------------------*/
async function getOrdenes(data) {
	return peticionAjax('eventos/ordenes', data)
	.then(dataJson => {
		if (dataJson.length > 0) {
			tbody_orden.innerHTML = mostrarOrdenes(dataJson)
		} else {
			tbody_orden.innerHTML = ''
		}
	})
}

/*----------------- ABRE EL MODAL ORDEN DE SERVICIO ---------------*/
function abrirAgregarOrden() {
	const tabs = md_orden.querySelectorAll('.tab'),
		btns_agregar = md_orden.querySelectorAll('.success'),
		btns_editar = md_orden.querySelectorAll('.atention'),
		btns_mas = md_orden.querySelectorAll('.primary');

	/** Permite abrir las tabs con la primer pestaña en click */
	tabs[0].click();

	tabs.forEach(tab => {
		tab.removeAttribute('style');
		tab.style.color = '#1b1b1b';
	});

	for (let i = 0; i < btns_agregar.length; i++) {
		btns_agregar[i].style.display = 'block';
		btns_editar[i].style.display = 'none';
		btns_mas[i].style.display = 'block';
	}
	md_orden.style.display = 'block';
}

/*------------ CARGA EL FORMULARIO ORDEN DE SERVICIO -----------*/
function openModalOrdenes(id) {

	openLoading();
	/** PINTA EL MODAL DE ORDEN */
	fetch('ordenes/get-one/' + id, {
		method: 'GET',
		headers: {
			'Cache-Control': 'no-store'
		}
	})
	.then(response => response.json())
	.then(dataJson => {
		printModalOrden(dataJson.data[0])
	})
	.then(() => {
		closeLoading();
		md_orden.style.display = 'block';
	})
}

/**--- ABRIR MODAL LOGÍSTICA ----*/
function abrirAgregarLogistica() {
	let fecha = document.querySelector('#date_start').value,
		hora = document.getElementById('time').value;

	btn_edit.style.display = 'none';
	btn_add.style.display = 'block';
	md_logistica.style.display = 'block';
	fecha_edit_log.value = fecha;
	time_start_log.value = hora;
	id_evento.value = e_id.value;
}

/**---- ABRIR EDITAR LOGISTICA ----*/
function abrirEditarLogistica(id) {
	openLoading()
	btn_add.style.display = 'none'
	obtenerDatosLog(id).then(() => {
		md_logistica.style.display = 'block'
		btn_edit.style.display = 'block'
		id_edit_log.value = id
		id_evento.value = e_id
		closeLoading()
	})
}

// TODO: ACTUALIZAR LAS PETICIONES AJAX
/**---- AGREGAR LOGÍSTICA ----*/
function addLogistica() {
	let logDatos = new FormData(form_logistica);
	logDatos.append('accion', 'agregar');

	openLoading()

	fetch('logistica/add', {
		method: 'POST',
		body: logDatos
	})
	.then(response => response.json())
	.catch(error => {
		popup.alert({ content: 'No hay conexión a Internet' })
		console.log(error);
	})
	.then(dataJson => {
		if (dataJson.error) {
			throw dataJson;
		}

		/** ACTUALIZA LAS ACTIVIDADES */
		$('#calendar').fullCalendar('refetchEvents');
		let log = new FormData(),
			md_logis = document.querySelector('#md_logistica');

		log.append('id', id_evento.value)

		getLogistica(log)
		.then(() => closeLoading())

		md_logis.style.display = 'none'
		form_logistica.reset()
	})
	.catch(error => {
		popup.alert({ content: error.msg });
	})
}

/**---- EDITAR LOGÍSTICA ----*/
function editLogistica() {
	let logDatos = new FormData(form_logistica)
	let modal = document.querySelector('#md_logistica')
	logDatos.append('accion', 'modificar')

	openLoading()

	fetch('logistica/edit', {
		method: 'POST',
		body: logDatos
	})
	.then(response => response.json())
	.catch(error => {
		popup.alert({ content: 'No hay conexión a Iternet' })
		console.log(error);
	})
	.then(dataJson => {
		if (dataJson.error) {
			throw dataJson;
		}
		/** ACTUALIZA LAS ACTIVIDADES */
		let log = new FormData()
		
		log.append('id', id_evento.value)
		$('#calendar').fullCalendar('refetchEvents');

		getLogistica(log)
		.then(() => {
			closeLoading()
			form_logistica.reset()
			modal.style.display = 'none'
		})
	})
	.catch(error => {
		popup.alert({ content: error.msg });
	})
}

/**---- ENVIAR DETALLE LOGÍSTICA ----*/
function ajaxDetalleLogistica(data) {
	fetch('core/ajax/logisticaAjaxController.php', {
		method: 'POST',
		body: data
	})
		.then(response => response.json())
		.catch(error => popup.alert({ content: 'No hay conexión a Iternet' }))
		.then(dataJson => {
			mostrarLogistica(dataJson)
		})
}

/**---- OBTENER DATOS DE UNA ACTIVIDAD ----*/
async function obtenerDatosLog(id) {
	return await fetch('logistica/get-one/' + id)
	.then(response => response.json())
	.then(dataJson => {
		const activ = document.querySelector('#actividad_log');
		let lugar = document.querySelector('#lugar_log'),
			id_log = document.querySelector('#id_edit_log'),
			fecha = document.querySelector('#fecha_edit_log'),
			time = document.querySelector('#time_start_log');

		for (let i in dataJson) {
			let item = dataJson[i],
				date = item.start.split(' ');

			activ.value = item.title;
			lugar.value = item.lugar;
			id_log.value = item.id_sub_evento;
			id_evento.value = item.id_evento;
			fecha.value = date[0];
			time.value = date[1];
		}
	})
}

function cloneOrden(orderId) {
	let data = new FormData()
	let url = 'ordenes/clone'

	data.append('orden_id', orderId)

	ajaxRequest(url, data)
	.then(dataJson => {
		if (dataJson.error) {
			throw dataJson;
		}

		let ord = new FormData();
		ord.append('id', e_id.value);
		getOrdenes(ord)
	})
	.catch(error => {
		popup.alert({ content: 'Error: ' + error.msg });
	})
}

function openEditOrden(orderId) {
	const btns_add = md_orden.querySelectorAll('.success'),
	btns_edit = md_orden.querySelectorAll('.atention'),
	btns_ext = md_orden.querySelectorAll('.primary')

	btns_add.forEach(b => b.style.display = 'none')
	btns_edit.forEach(b => b.style.display = 'block')
	btns_ext.forEach(b => b.style.display = 'none')
	openModalOrdenes(orderId)
}

function destroyOrden(orderId) {
	popup.confirm({
		content: '<strong>Eliminar</strong><br><br>¿Está seguro?',
		default_btns: {
			ok: 'SÍ',
			cancel: 'NO'
		}
	},
	(click) => {
		if (click.proceed) {
			deleteOrden(orderId)
		}
	})
}

function deleteOrden(orderId) {
	let datos = new FormData();

	datos.append('id_evento', e_id.value)
	datos.append('accion', 'eliminar')
	datos.append('id', orderId)

	/** PIDE BORRAR EL REGISTRO */
	fetch('ordenes/del', {
		method: 'POST',
		body: datos
	})
	.then(response => response.json())
	.catch(error => popup.alert({ content: 'No hay conexión\n' + error }))

	.then(dataJson => {
		if (dataJson.error) {
			throw dataJson
		}
		let ord = new FormData()
		ord.append('id', e_id.value)
		getOrdenes(ord) // Actualizo las ordenes
	})
	.catch(error => {
		popup.alert({ content: error.msg });
	})
}

/*-----------------------------AGREGAR ORDEN DE SERVICIO------------------*/
function createOrden() {
	popup.confirm({
		content: 'Confirmar cambios',
		default_btns: {
			ok: 'SÍ', cancel: 'NO'
		}
	},
	(clck) => {
		if (clck.proceed) {
			if (formClass[0] == 'form') {
				enviarFormulario(e.target, forms, addOrden)
			}
		}
	})
}

function addOrden(frm, forms) {
	let fecha = document.querySelector('#date_start'),
		data = new FormData(frm)

	data.append('accion', 'agregar');
	data.append('id_evento', e_id.value);
	data.append('fecha', fecha.value);

	fetch('ordenes/add', {
		method: 'POST',
		body: data
	})
	.then(response => response.json())
	.catch(error => popup.alert({ content: 'No hay conexión\n' + error }))

	.then(dataJson => {
		if (dataJson.error) {
			throw dataJson
		}

		/** RECARGO LOS REGISTROS */
		let ord = new FormData;
		ord.append('id', e_id.value);

		obtenerOrdenes(ord)
		.then(dataJson => {
			let results = dataJson.length;

			if (results <= 0)
				console.log('No hay ordenes', dataJson.length);

			mostrarOrdenes(dataJson);
			md_orden.style.display = 'none';
		})

		borrarCamposExtra();
		forms.forEach(item => item.reset());
	})
	.catch(error => {
		popup.alert({ content: error.msg });
	})
}

function editOrden(e) {
	let form = e.target.parentElement.parentElement
	let forms = md_orden.querySelectorAll('.form')
	
	popup.confirm({
		content: 'Confirmar cambios',
		default_btns: {
			ok: 'SÍ', cancel: 'NO'
		}
	},
	(click) => {
		if (click.proceed) {
			updateOrden(form, forms)
		}
	})
}

/*----------------- EDITAR ORDEN --------------------------*/
function updateOrden(frm, forms) {
	let fecha = document.querySelector('#date_start'),
		time = document.querySelector('#time'),
		formData = new FormData(frm);

	formData.append('accion', 'modificar');
	formData.append('id_evento', e_id.value);
	formData.append('fecha', fecha.value);

	fetch('ordenes/edit', {
		method: 'POST',
		body: formData
	})
	.then(response => response.json())
	.then(resJson => {
		let ord = new FormData();
		ord.append('id', e_id.value)

		getOrdenes(ord)
		md_orden.style.display = 'none';
		borrarCamposExtra();
		forms.forEach(item => item.reset());
	})
	.catch(error => {
		popup.alert({ content: error.msg });
	})
}

function enviarFormulario(btn, frms, callback) {
	let form_id = btn.getAttribute('form')
	form = md_orden.querySelector('#' + form_id)
	callback(form, frms)
}