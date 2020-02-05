"use strict"

/**
 * Fullcalendar
 */
function handleEventClick(calEvent, jsEvent, view) {
	if (calEvent.evento != null && view.name == 'month') {
		openLoading()
		form_evento.innerHTML = formWithData(calEvent)
		openModal('m_evento')
	}
}

/**
 * Devuelve una plantilla de los campos del evento
 * 
 * @param {json} calEvent Datos del evento seleccionado
 */
function formWithData(calEvent) {
	let status = ''
	let fechaHora_i = calEvent.start._i.split(" ")
	let fechaHora_f = calEvent.end._i.split(" ")

	switch (calEvent.color) {
		case '#d7c735':
			status = 'TENTATIVO';
			break;
		case '#f98710':
			status = 'APARTADO';
			break;
		case '#54b33d':
			status = 'CERRADO';
	}

	return `
	<input id="e_id" type="hidden" name="id" value="${ calEvent.id_evento }">
	<div class="row-between">
		<div class="col-xs-12 col-sm-5">
			Titulo
			<span class="etiqueta col-xs-12" id="e_title">${ calEvent.title }</span><br>
			Evento
			<span class="etiqueta col-xs-12" id="e_evento">${ calEvent.evento }</span><br><br>
			<div class="row-between">
				<div class="col-xs-6">
					Personas
					<span class="etiqueta col-xs-11" id="e_personas">${ calEvent.personas + ' PX' }</span><br>
					Fecha inicio
					<span class="etiqueta col-xs-11" id="date">${ fechaHora_i[0] }</span><br>	
					Hora inicio
					<span class="etiqueta col-xs-11" id="time">${ fechaHora_i[1] }</span>
				</div>
				<div class="col-xs-6">
					Status
					<span class="etiqueta col-xs-12" id="e_status">${ status }</span>
					Fecha final
					<span class="etiqueta col-xs-12" id="date_f">${ fechaHora_f[0] }</span><br>
					Hora final
					<span class="etiqueta col-xs-12" id="time_f">${ fechaHora_f[1] }</span>
				</div>
			</div>
		</div>
		<div class="col-xs-12 col-sm-6">
			Cliente
			<span class="etiqueta col-xs-12" id="e_contacto">${ calEvent.contacto }</span><br>
			Responsable
			<span class="etiqueta col-xs-12" id="e_cord_resp">${ calEvent.cord_resp }</span><br>
			Cord. Apoyo
			<span class="etiqueta col-xs-12" id="e_cord_apoyo">${ calEvent.cord_apoyo }</span><br>
			Descripción
			<span class="etiqueta col-xs-12" id="e_description">${ calEvent.description }</span><br><br>
			<div class="row-between">
				<div class="col-xs-6">
					Salón / Lugar 
					<span class="etiqueta col-xs-11" id="e_place">${ calEvent.lugar }</span>
				</div><br>
				<div class="col-xs-6">
					Categoria
					<span class="etiqueta col-xs-12" id="txtcategoria">${ calEvent.categoria }</span>
				</div>
			</div>
		</div>
	</div>`
}

/**
 * Abre una ventana modal
 */
function openModal(modalId) {
	let body = document.getElementById('body')
	let m = document.getElementById(modalId)

	body.setAttribute('style', 'overflow: hidden; padding-right: 17px')
	m.style.display = 'block'
	closeLoading()
}

/**
 * Submodal eventos
 */
async function abrirDetalleEvento(e) {
	let input_id = document.getElementById('e_id')
	let modal = document.getElementById('MD_evento')
	let table = document.getElementById('tbody_orden')
	let btn_detalle = input_id.value
	let data = new FormData()

	openLoading()
	data.append('id', btn_detalle)

	await ajaxLogistica(data)

	peticionAjax('eventos/ordenes', data)
	.then(dataJson => {
		table.innerHTML = listOrdenes(dataJson)
		closeLoading()
		modal.style.display = 'block'
	})
}

async function ajaxLogistica(data) {
	let table = document.getElementById('tb_logistica')

	return fetch('eventos/logistica', {
		method: 'POST',
		body: data
	})
	.then(response => {
		return response.json()
	})
	.then(dataJson => {
		table.innerHTML = listLogistica(dataJson)
	})
}

function listLogistica(data) {
	let textHtml = ''
	let fechahora = ''

	for (let val of data) {
		fechahora = val.start.split(' ', 2)
		textHtml += `
		<tr>
			<td>${fechahora[0]}</td>
			<td>${fechahora[1]}</td>
			<td>${val.title}</td>
			<td>${val.lugar}</td>
		</tr>`
	}
	return textHtml
}

function listOrdenes(data) {
	let textHtml = ''
	let fechahora = ''

	for (let val of data) {
		fechahora = val.fecha.split(' ', 2)
		textHtml += `
		<tr>
			<td>${val.id_orden}</td>
			<td>${val.orden}</td>
			<td>${val.lugar}</td>
			<td>${fechahora[0]}</td>
			<td>
			<a class="btn atention" href="ordenes/print/${val.id_orden}" target="_black">
			<i class="fas fa-print"></i>
			</a>
			</td>
		</tr>`
	}
	return textHtml
}