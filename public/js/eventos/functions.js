"use strict"
// TODO: ELIMINAR JQUERY

/**
 * Fullcalendar
 */
function handlerDayClick(date, jsEvent, view) {
	let modal = document.getElementById('M_evento')
	btnDetalleEvento.setAttribute('disabled', 'disabled')

	if (view.name == 'month') {
		on_create.style.display = 'flex'
		on_edit.style.display = 'none'
		modal.querySelectorAll('input')[1].focus()

		form_evento.innerHTML = limpiarFormEvento(date)
		
		openLoading()
		getSelectLugares('id_lugar')
		.then(() => {
			closeLoading()
			openModal('M_evento')
		})
	}
}

function handlerEventClick(calEvent, jsEvent, view) {
	getIngreso(calEvent)
	btnDetalleEvento.removeAttribute('disabled')
	on_edit.style.display = 'flex'
	on_create.style.display = 'none'

	if (calEvent.evento != null && view.name == 'month') {
		let formHtml = newPrintModalEvento(calEvent)
		form_evento.innerHTML = formHtml
		openLoading()
		getSelectLugares('id_lugar')
		.then(() => {
			closeLoading()
			openModal('M_evento')
		})
	}
}

/** AGREGAR EVENTO */
function addEvento() {
	if (personas.value === '') {
		popup.alert({ content: 'No el campo de personas debe ser de tipo numérico' })
		return 0
	}
	if (nuevoEvento === '') {
		popup.alert({ content: 'La fecha de finalización no puede ser anterior a la fecha de inicio' })
		return 0
	}
	openLoading()
	enviarInformacion('crear', 'form_evento')
	.then(() => {
		closeLoading()
	})
}

/** ELIMINAR EVENTO */
function eliminarEvento() {
	openLoading()
	enviarInformacion('eliminar', 'form_evento')
	.then(() => {
		closeLoading()
	})
}

/** EDITAR EVENTO */
function modificarEvento() {
	if (personas.value === '') {
		popup.alert({ content: 'No el campo de personas debe ser de tipo numérico' })
		return 0
	}
	if (nuevoEvento === '') {
		popup.alert({ content: 'La fecha de finalización no puede ser anterior a la fecha de inicio' })
		return 0
	}
	openLoading()
	enviarInformacion('editar', 'form_evento')
	.then(() => {
		closeLoading()
	})
}

/** MANDAR DATOS DEL EVENTO POR AJAX */
function enviarInformacion(accion, form_id) {
	let form = document.getElementById(form_id)
	let data = new FormData(form)

	data.append('start', date_start.value + ' ' + time.value)
	data.append('end', date_end.value + ' ' + time_f.value)

	return axios.post('eventos/' + accion, data)
	.then(resJson => {
		showToast(resJson.data.message)
		$('#calendar').fullCalendar('refetchEvents')
		cerrarModal('', 'M_evento')
	})
	.catch(err => {		
		if (err.response.status == 401) {
			swal.fire({
				icon: 'error',
				title: err.response.data.message
			})
		}
		if (err.response.status == 422) {
			let textHtml = ''
			for (let i in err.response.data.errors) {
				textHtml += err.response.data.errors[i] + '<br>'
			}
			swal.fire({
				icon: 'error',
				title: err.response.data.message,
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

	// ajaxRequest('eventos/get-ingreso', dataIng)
	axios.post('eventos/get-ingreso', dataIng)
	.then(resJson => {
		let val = resJson.data.ingreso[0];

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
	axios.get('tipo-eventos/get-all')
	.then(resJson => {		
		text = `<option value="${resJson[0].nombre_tevento}">- Elegir -</option>`

		for (i in resJson) {
			t = resJson[i];
			text += `<option value="${t.nombre_tevento}">${t.nombre_tevento}</option>`
		}
		e_evento.innerHTML = text;
	})
}

function getSelectLugares(selectId) {
	let select = document.getElementById(selectId)
	let rowHTML = ''

	return new Promise((resolve, reject) => {
		axios.get('lugares/todos')
		.then(resJson => {
			let res = resJson.data
			
			rowHTML = `<option value="${res[0].id_lugar}"> - Elegir - </option>`
			if (res != 'fail') {
				for (let i in res) {
					let item = res[i]
					rowHTML += `<option value="${item.id_lugar}"> ${item.lugar} </option>`
				}            
			} else {
				rowHTML = `<option value="2"> No se han registrado lugares </option>`
			}
			select.innerHTML = rowHTML
			resolve()
		})
		.catch(error => {
			console.log(`Surgió un error: ${error.response.data.message}`)
			reject()
		})
	})
}

function destroyLogistica(logisticaId) {
	let data = new FormData()

	swal.fire({
		icon: 'warning',
		title: 'Eliminar',
		text: '¿Está seguro(a)?',
		showCancelButton: true
	})
	.then(click => {
		if (click.value) {
			openLoading()

			data.append('accion', 'eliminar')
			data.append('id_evento', e_id.value)
			data.append('id', logisticaId)

			// Pide eliminar la actividad
			axios.post('logistica/del', data)
			.then(resJson => {
				let log = new FormData();
				log.append('id', id_evento.value)
				
				/** ACTUALIZA LAS ACTIVIDADES */
				getLogistica(log)
				.then(() => {
					closeLoading()
					showToast(resJson.data.success)
				})
			})
			.catch(error => {
				closeLoading()
				swal.fire({
					icon: 'error',
					title: error.response.data.message
				})
			})
		}
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
	let table_body = document.getElementById('tb_logistica')
	let textHtml = ''

	return peticionAjax('eventos/logistica', data)
	.then(resJson => {
		if (resJson.length > 0) {
			table_body.innerHTML = mostrarLogistica(resJson)
		} else {
			table_body.innerHTML = ''
		}
	})
}

/**----------------- OBTENER ORDENES DE SERVICIO ------------------*/
async function getOrdenes(data) {
	return axios.post('eventos/ordenes', data)
	.then(dataJson => {
		if (dataJson.data.length > 0) {
			tbody_orden.innerHTML = mostrarOrdenes(dataJson.data)
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
	openLoading()
	axios.get('ordenes/get-one/' + id)
	.then(resJson => {		
		printModalOrden(resJson.data.order)
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
		id_evento.value = e_id.value
		closeLoading()
	})
}

/**---- AGREGAR LOGÍSTICA ----*/
function addLogistica() {
	let logDatos = new FormData(form_logistica)
	logDatos.append('accion', 'agregar')

	openLoading()
	axios.post('logistica/add', logDatos)
	.then(resJson => {		
		let log = new FormData()
		let md_logis = document.querySelector('#md_logistica')
			
		log.append('id', id_evento.value)
			
		/** ACTUALIZA LAS ACTIVIDADES */
		getLogistica(log)
		.then(() => {
			closeLoading()
			showToast(resJson.data.success)
			md_logis.style.display = 'none'
		})
		.then(() => {
			form_logistica.reset()
		})

	})
	.catch(error => {		
		closeLoading()
		let textHtml = ''
		if (error.response.status == 422) {
			for (let i in error.response.data.errors) {				
				textHtml += error.response.data.errors[i] + `<br>`
			}
		}
		swal.fire({
			icon: 'error',
			title: error.response.data.message,
			html: textHtml
		})
	})
}

/**---- EDITAR LOGÍSTICA ----*/
function editLogistica() {
	let logDatos = new FormData(form_logistica)
	let modal = document.querySelector('#md_logistica')
	logDatos.append('accion', 'modificar')

	openLoading()
	axios.post('logistica/edit', logDatos)
	.then(resJson => {
		let log = new FormData()
		
		log.append('id', id_evento.value)
		
		/** ACTUALIZA LAS ACTIVIDADES */
		getLogistica(log)
		.then(() => {
			closeLoading()
			showToast(resJson.data.success)
			modal.style.display = 'none'
		})
		.then(() => {
			form_logistica.reset()
		})
	})
	.catch(error => {
		closeLoading()
		let textHtml = ''
		if (error.response.status == 422) {
			for (let i in error.response.data.errors) {				
				textHtml += error.response.data.errors[i] + `<br>`
			}
		}
		swal.fire({
			icon: 'error',
			title: error.response.data.message,
			html: textHtml
		})
	})
}

/**---- OBTENER DATOS DE UNA ACTIVIDAD ----*/
function obtenerDatosLog(id) {
	return axios.get('logistica/get-one/' + id)
	.then(resJson => {
		let activities = resJson.data
		let $activ = document.querySelector('#actividad_log')
		let $lugar = document.querySelector('#lugar_log')
		let $id_log = document.querySelector('#id_edit_log'),
			$fecha = document.querySelector('#fecha_edit_log'),
			$time = document.querySelector('#time_start_log')

		for (let i in activities) {
			let item = activities[i],
				date = item.start.split(' ')

			$activ.value = item.title
			$lugar.value = item.lugar
			$id_log.value = item.id_sub_evento
			id_evento.value = item.id_evento
			$fecha.value = date[0]
			$time.value = date[1]
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

		let ord = new FormData()
		ord.append('id', e_id.value)
		getOrdenes(ord)
	})
	.catch(error => {
		popup.alert({ content: 'Error: ' + error.msg })
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
	let data = new FormData()

	swal.fire({
		icon: 'warning',
		title: 'Eliminar',
		text: '¿Está seguro(a)?',
		showCancelButton: true
	})
	.then(click => {
		if (click.value) {
			data.append('id_evento', e_id.value)
			data.append('accion', 'eliminar')
			data.append('id', orderId)
			openLoading()

			axios.post('ordenes/del', data)
			.then(resJson => {
				data = new FormData()
				data.append('id', e_id.value)
				// Actualizo las ordenes
				showToast(resJson.data.success)
				getOrdenes(data).then(() => closeLoading())
			})
			.catch(error => {
				swal.fire({
					icon: 'error',
					title: error.response.data.message
				})
			})
		}
	})
}

/*-----------------------------AGREGAR ORDEN DE SERVICIO------------------*/
function createOrden(e) {
	let form = e.target.parentElement.parentElement
	let forms = md_orden.querySelectorAll('.form')

	popup.confirm({
		content: 'Confirmar cambios',
		default_btns: {
			ok: 'SÍ', cancel: 'NO'
		}
	},
	(clck) => {
		if (clck.proceed) {
			openLoading()
			addOrden(form, forms)
			.then(() => {
				closeLoading()
			})
		}
	})
}

function addOrden(frm, forms) {
	let fecha = document.querySelector('#date_start')
	let data = new FormData(frm)

	data.append('id_evento', e_id.value)
	data.append('fecha', fecha.value)

	return axios.post('ordenes/add', data)
	.then(resJson => {
		let ord = new FormData;
		ord.append('id', e_id.value)

		showToast(resJson.data.success)
		getOrdenes(ord)
		md_orden.style.display = 'none'
	})
	.then(() => {
		borrarCamposExtra()
		forms.forEach(item => item.reset())
	})
	.catch(error => {
		errors = error.response.data.errors
		let textHtml = ''

		for (let i in errors) {
			textHtml += errors[i] + '<br>'
		}
		
		swal.fire({
			icon: 'error',
			title: error.response.data.message,
			html: textHtml
		})
	})
}

function editOrden(e) {
	let form = e.target.parentElement.parentElement
	let forms = md_orden.querySelectorAll('.form')
	
	swal.fire({
		icon: 'warning',
		title: 'Confirmar cambios',
		showCancelButton: true
	})
	.then(click => {
		if (click.value) {
			openLoading()
			updateOrden(form, forms)
			.then(() => {
				closeLoading()
			})
		}
	})
}

/*----------------- EDITAR ORDEN --------------------------*/
function updateOrden(frm, forms) {
	let fecha = document.querySelector('#date_start')
	let time = document.querySelector('#time')
	let data = new FormData(frm)

	data.append('id_evento', e_id.value)
	data.append('fecha', fecha.value)

	return axios.post('ordenes/edit', data)
	.then(resJson => {
		let ord = new FormData()
		ord.append('id', e_id.value)

		showToast(resJson.data.success)
		getOrdenes(ord)
		md_orden.style.display = 'none'
	})
	.then(() => {
		borrarCamposExtra()
		forms.forEach(item => item.reset())
	})
	.catch(error => {
		let textHtml = ''
		errors = error.response.data.errors
		for (let i in errors) {
			textHtml += errors[i] + '<br>'
		}
		swal.fire({
			icon: 'error',
			title: error.response.data.message,
			html: textHtml
		})
	})
}