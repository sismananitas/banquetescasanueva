"use strict"
/**--------------------- PINTAR FORMULARIO EVENTOS -------------*/
function printModalEvento(calEvent) {	
	let select         = document.querySelector('#idlugar option:first-child')
	
	e_id.value         = calEvent.id_evento
	e_title.value      = calEvent.title
	e_evento.value     = calEvent.evento
	e_contacto.value   = calEvent.contacto
	e_cord_resp.value  = calEvent.cord_resp
	e_cord_apoyo.value = calEvent.cord_apoyo
	e_description.innerHTML = calEvent.description
	e_place.innerHTML  = calEvent.lugar
	idlugar.value      = calEvent.id_lugar
	select.value       = calEvent.id_lugar

	let fechaHora    = calEvent.start._i.split(" ")
	date_start.value = fechaHora[0]
	time.value       = fechaHora[1]

	let fechaHora_f = calEvent.end._i.split(" ");
	
	if (fechaHora_f.length > 1) {
		date_end.value = fechaHora_f[0]
		time_f.value   = fechaHora_f[1]
	}	

	color.value       = calEvent.color
	e_folio.value     = calEvent.folio
	idcategoria.value = calEvent.categoria
	personas.value    = calEvent.personas
	txtcategoria.innerHTML = calEvent.categoria

	switch (calEvent.color) {
		case '#d7c735':
			e_status.innerHTML = 'Tentativo';
			break;

		case '#f98710':
			e_status.innerHTML = 'Apartado';
			break;

		case '#54b33d':
			e_status.innerHTML = 'Confirmado';
			break;
	}
}

function newPrintModalEvento(event) {
	let templateForm = ''

	let fechaHora_start  = event.start._i.split(" ")
	let fechaHora_end = event.end._i.split(" ")

	let date_start = fechaHora_start[0]
	let time_start = fechaHora_start[1]
	
	let date_end = fechaHora_end[0]
	let time_end   = fechaHora_end[1]

	templateForm = `
	<input id="e_id" type="hidden" name="id" value="${event.id_evento}">
	<div class="row-between">
		<div class="col-xs-12 col-sm-6">
			Titulo *<br>
			<input id="e_title" class="col-xs-12 col-sm-11" type="text" name="titulo" value="${event.title}" required>
			<div class="row-between col-xs-12 col-sm-11">
				<div class="col-xs-6">
					Evento *<br>
					<input id="e_evento" class="col-xs-12 col-sm-11" type="text" name="evento" value="${event.evento}" required>
				</div>
				<div class="col-xs-6">
					Personas *<br>
					<input id="personas" class="col-xs-12" type="number" name="personas" value="${event.title}" required>
				</div>
				<div class="col-xs-6">
					Fecha<br>
					<input
						id="date_start"
						class="col-xs-12 col-sm-11 line-block"
						type="date" min="1900-04-01" name="fecha" value="${date_start}"
					>
					<br>
					Hora inicio<br>
					<input id="time" class="col-xs-12 col-sm-11 line-block" type="time" name="hora" value="${time_start}"><br>
				</div>
				<div class="col-xs-6">
					Fecha final<br>
					<input id="date_end" class="col-xs-12" type="date" name="fecha" value="${date_end}"><br>
					Hora final<br>
					<input id="time_f" class="col-xs-12" type="time" name="hora" value="${time_end}"><br>
				</div>
				<div class="col-xs-6">
					Status
					<a id="e_status" class="pill">${event.status}</a><br>
					<select
						id="color"
						class="col-xs-12 col-sm-11"
						name="color"
						value="${event.color}"
					>
						<option id="old_color" value="#d7c735">- Elegir -</option>
						<option value="#d7c735">Tentativo</option>
						<option value="#f98710">Apartado</option>
						<option value="#54b33d">Cerrado</option>
					</select>
				</div>
				<div class="col-xs-6">
					Categoria
					<a id="txtcategoria" class="pill">${event.categoria}</a><br>
					<select id="categoria" class="col-xs-12" name="categoria" value="${event.categoria}">
						<option id="idcategoria" value="Privado">- Seleccionar -</option>
						<option value="Social"> Social </option>
						<option value="Empresarial"> Empresarial </option>
						<option value="Casa"> Casa </option>
					</select>
				</div>
			</div>
		</div>
		<div class="col-xs-12 col-sm-6">
			Cliente *<br>
			<input id="e_contacto" class="col-xs-12" type="text" name="contacto" value="${event.contacto}">
			<div class="row-between">
				<div class="col-xs-6">
					Responsable *<br>
					<input id="e_cord_resp" class="col-xs-12 col-sm-11" type="text" name="resp" value="${event.cord_resp}">
				</div>
				<div class="col-xs-6">
					Cord. Apoyo<br>
					<input id="e_cord_apoyo" class="col-xs-12" type="text" name="apoyo" value="${event.cord_apoyo}">
				</div>
			</div>
			<div class="row-between">
				<div class="col-xs-6">
					<label for="idlugar">Salón</label>
					<a id="e_place" class="pill">${event.lugar}</a>
					<select id="idlugar" class="col-xs-12 col-sm-11" name="idlugar" value="${event.id_lugar}">
					</select>
				</div>
				<div class="col-xs-6">
					Folio Front2Go <br>
					<input id="e_folio" class="col-xs-12" type="text" name="folio" placeholder="Agregar" value="${event.folio}">
				</div>
			</div>
			Observaciones<br>
			<textarea id="e_description" class="col-xs-12" name="descrip" rows='3'>${event.description}</textarea>
		</div>
	</div>`
	return templateForm
}

/**---------------- LIMPIA EL FORMULARIO EVENTOS ---------------*/
function limpiarDatosEvento(date) {
	color.value = '#d7c735'
	e_ingreso.value = '$ 00.00'

	date_start.value = date.format('YYYY-MM-DD')
	date_end.value = date.format('YYYY-MM-DD')

	time.value = '00:00:00'
	time_f.value = '23:00:00'

	e_status.innerHTML = ''
	txtcategoria.innerHTML = ''
	e_place.innerHTML = ''
	e_description.innerHTML = ''
}

/**---- CAMBIA LA FECHA DEL EVENTO AL ARRASTRAR -----*/
function arrastrarEvento(calEvent) {
	e_id.value 	       = calEvent.id_evento
	e_title.value      = calEvent.title
	e_evento.value     = calEvent.evento
	e_contacto.value   = calEvent.contacto
	e_cord_resp.value  = calEvent.cord_resp
	e_cord_apoyo.value = calEvent.cord_apoyo
	e_place.innerHTML  = calEvent.lugar
	idlugar.value      = calEvent.id_lugar
	e_description.innerHTML = calEvent.description


	fechaHora  = calEvent.start.format().split('T')
	date.value = fechaHora[0]
	time.value = fechaHora[1]

	fechaHora_f  = calEvent.end.format().split('T')
	date_f.value = fechaHora_f[0]
	time_f.value = fechaHora_f[1]

	categoria.value = calEvent.categoria
	personas.value  = calEvent.personas

	recolectarDatosGUI()
	enviarInformacion('modificar', nuevoEvento)
}