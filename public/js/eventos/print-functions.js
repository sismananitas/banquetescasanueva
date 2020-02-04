
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

function limpiarFormEvento(date) {
	return `
	<input id="e_id" type="hidden" name="id">
	<div class="row-between">
		<div class="col-xs-12 col-sm-6">
			Titulo *<br>
			<input id="e_title" class="col-xs-12 col-sm-11" type="text" name="titulo" required>
			<div class="row-between col-xs-12 col-sm-11">
				<div class="col-xs-6">
					Evento *<br>
					<input id="e_evento" class="col-xs-12 col-sm-11" type="text" name="evento" required>
				</div>
				<div class="col-xs-6">
					Personas *<br>
					<input id="personas" class="col-xs-12" type="number" name="personas" required>
				</div>
				<div class="col-xs-6">
					Fecha<br>
					<input id="date_start" class="col-xs-12 col-sm-11 line-block" type="date" min="1900-04-01" name="fecha" value="${date.format('YYYY-MM-DD')}"><br>
					Hora inicio<br>
					<input id="time" class="col-xs-12 col-sm-11 line-block" type="time" name="hora" value="00:00:00"><br>
				</div>
				<div class="col-xs-6">
					Fecha final<br>
					<input id="date_end" class="col-xs-12" type="date" name="fecha" value="${date.format('YYYY-MM-DD')}"><br>
					Hora final<br>
					<input id="time_f" class="col-xs-12" type="time" name="hora" value="23:00:00"><br>
				</div>
				<div class="col-xs-6">
					Status
					<a id="e_status" class="pill"></a><br>
					<select id="color" class="col-xs-12 col-sm-11" name="color">
						<option id="old_color" value="#d7c735">- Elegir -</option>
						<option value="#d7c735">Tentativo</option>
						<option value="#f98710">Apartado</option>
						<option value="#54b33d">Cerrado</option>
					</select>
				</div>
				<div class="col-xs-6">
					Categoria
					<a id="txtcategoria" class="pill"></a><br>
					<select id="categoria" class="col-xs-12" name="categoria">
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
			<input id="e_contacto" class="col-xs-12" type="text" name="contacto">
			<div class="row-between">
				<div class="col-xs-6">
					Responsable *<br>
					<input id="e_cord_resp" class="col-xs-12 col-sm-11" type="text" name="resp">
				</div>
				<div class="col-xs-6">
					Cord. Apoyo<br>
					<input id="e_cord_apoyo" class="col-xs-12" type="text" name="apoyo">
				</div>
			</div>
			<div class="row-between">
				<div class="col-xs-6">
					<label for="idlugar">Salón</label>
					<a id="e_place" class="pill"></a>
					<select id="idlugar" class="col-xs-12 col-sm-11" name="idlugar">
						<!-- js -->
					</select>
				</div>
				<div class="col-xs-6">
					Folio Front2Go <br>
					<input id="e_folio" class="col-xs-12" type="text" name="folio" placeholder="Agregar">
				</div>
			</div>
			Observaciones<br>
			<textarea id="e_description" class="col-xs-12" name="descrip" rows='3'></textarea>
		</div>
	</div>`
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

/**----------------- PINTAR TABLA LOGÍSTICA --------------------*/
function mostrarLogistica(data) {
	let textHtml = ''

	for (let val of data) {
		let fechahora = val.start.split(' ', 2),
		date_format = fechahora[0]

		textHtml += `
		<tr>
			<td>${date_format}</td>
			<td>${fechahora[1]}</td>
			<td>${val.title}</td>
			<td>${val.lugar}</td>
			<td>
				<button class="atention" type="button" onclick="abrirEditarLogistica(${val.id_sub_evento})">
				<i class="fas fa-pen-alt"></i>
				</button>
				<button class="danger" type="button" onclick="destroyLogistica(${val.id_sub_evento})">
				<i class="fas fa-trash"></i>
				</button>
			</td>
		</tr>`
	}
	return textHtml
}

/**----------------- PINTAR TABLA ORDENES ------------------*/
function mostrarOrdenes(data) {
	let textHtml = ''

	for (let val of data) {
		let fechahora = val.fecha.split(' ', 2),
		date_format = fechahora[0]

		textHtml += `
		<tr data-item="${val.id_orden}">
			<td>
				<a class="btn atention" href="ordenes/print/${val.id_orden}" target="_blank" title="ver PDF">
				<i class="fas fa-print"></i>
				</a>
				<button
					id="btn_clonar_orden"
					class="btn primary"
					style="margin-top: 4px;"
					title="clonar"
					onclick="cloneOrden(${val.id_orden})"
				>
					Duplicar
				</button>
			</td>
			<td>${val.orden}</td>
			<td>${val.lugar}</td>
			<td>${date_format}</td>
			<td>
				<button class="atention" type="button" onclick="openEditOrden(${val.id_orden})">
				<i class="fas fa-pen-alt"></i>
				</button>
				<button class="danger" type="button" onclick="destroyOrden(${val.id_orden})">
				<i class="fas fa-trash"></i>
				</button>
			</td>
		</tr>`
	}
	return textHtml
}

/**---- PINTA EL MODAL ORDEN DE SERVICIO ---*/
function printModalOrden(dataOrden) {
	const ord = dataOrden	

	let mdl = document.getElementById('md_orden'),
		tabs = mdl.querySelectorAll('.tab')

	let id_orden = mdl.querySelectorAll('.id_orden'),
		evento = mdl.querySelectorAll('.o_nombre'),
		place = mdl.querySelectorAll('.o_place'),
		montaje = mdl.querySelectorAll('.o_montaje'),
		garantia = mdl.querySelectorAll('.o_garantia'),
		hora = mdl.querySelectorAll('.o_hora'),
		canapes = mdl.querySelectorAll('.o_canapes'),
		entrada = mdl.querySelectorAll('.o_entrada'),
		fuerte = mdl.querySelectorAll('.o_fuerte'),
		postre = mdl.querySelectorAll('.o_postre'),
		torna = mdl.querySelectorAll('.o_torna'),
		bebidas = mdl.querySelectorAll('.o_bebidas'),
		aguas = mdl.querySelector('.o_aguas_frescas'),
		cocteleria = mdl.querySelectorAll('.o_cocteleria'),
		mezcladores = mdl.querySelectorAll('.o_mezcladores'),
		dmontaje = mdl.querySelectorAll('.o_dmontaje'),
		ama_llaves = mdl.querySelectorAll('.o_ama_llaves'),
		chief_steward = mdl.querySelectorAll('.o_chief_steward'),
		mantenimiento = mdl.querySelectorAll('.o_mantenimiento'),
		seguridad = mdl.querySelectorAll('.o_seguridad'),
		rh = mdl.querySelectorAll('.o_RH'),
		proveedores = mdl.querySelectorAll('.o_proveedores'),
		contabilidad = mdl.querySelectorAll('.o_contabilidad'),
		formularios = mdl.querySelectorAll('form'),
		observaciones = mdl.querySelectorAll('.o_observaciones')

	/** Da click a la pestaña con el mismo formato */
	tabs.forEach(tab => {
		if (tab.innerHTML.toLowerCase() === ord.tipo_formato)
			tab.click()
	});

	tabs.forEach(tab => {
		tab.style.pointerEvents = 'none';
		tab.style.color = '#5f5f5f';
	});

	for (let j = 0; j < 4; j++) {
		let fechahora = ord.fecha.split(' ');

		id_orden[j].value = ord.id_orden;
		evento[j].value = ord.orden;
		garantia[j].value = ord.garantia;
		place[j].value = ord.lugar;
		montaje[j].value = ord.montaje;
		hora[j].value = fechahora[1];
		dmontaje[j].value = ord.detalle_montaje;
		ama_llaves[j].value = ord.ama_llaves;
		mantenimiento[j].value = ord.mantenimiento;
	}

	switch (ord.tipo_formato) {
		case 'ceremonia':
			observaciones[1].value = ord.observaciones;
			seguridad[0].value = ord.seguridad;
			rh[0].value = ord.recursos_humanos;
			proveedores[0].value = ord.proveedores;

			getCamposExtra(ord.id_orden).then(res => {
				nc_ceremonia = pintarCampos(res, campos_ceremonia, nc_ceremonia)
			})
			break;

		case 'grupo':
			canapes[0].value = ord.canapes;
			observaciones[0].value = ord.observaciones;
			contabilidad[0].value = ord.contabilidad;
			chief_steward[0].value = ord.chief_steward;
			bebidas[0].value = ord.bebidas;

			getCamposExtra(ord.id_orden).then(res => {
				nc_grupo = pintarCampos(res, campos_grupo, nc_grupo)
			})
			break;

		case 'coctel':
			canapes[1].value = ord.canapes;
			cocteleria[0].value = ord.cocteleria;
			bebidas[1].value = ord.bebidas;
			aguas.value = ord.aguas_frescas;
			seguridad[1].value = ord.seguridad;
			rh[1].value = ord.recursos_humanos;
			proveedores[1].value = ord.proveedores;
			contabilidad[1].value = ord.contabilidad;
			chief_steward[1].value = ord.chief_steward;
			cocteleria[0].value = ord.cocteleria;
			mezcladores[0].value = ord.mezcladores;

			getCamposExtra(ord.id_orden).then(res => {
				nc_coctel = pintarCampos(res, campos_coctel, nc_coctel)
			})
			break;

		case 'banquete':
			entrada[0].value = ord.entrada;
			fuerte[0].value = ord.fuerte;
			postre[0].value = ord.postre;
			torna[0].value = ord.torna;
			seguridad[2].value = ord.seguridad;
			rh[2].value = ord.recursos_humanos;
			proveedores[2].value = ord.proveedores;
			contabilidad[2].value = ord.contabilidad;
			chief_steward[2].value = ord.chief_steward;
			bebidas[2].value = ord.bebidas;
			mezcladores[1].value = ord.mezcladores;
			observaciones[2].value = ord.observaciones;

			getCamposExtra(ord.id_orden).then(res => {
				nc_banquete = pintarCampos(res, campos_banquete, nc_banquete)
			})
			break;
	}
}

/** MODAL DETALLE DE LA ORDEN DE SEVICIO */
/**-----------------------------PINTAR CAMPOS EXTRA FORM -----------------------*/
function pintarCampos(arrayJson, camposContainer, numeroCampos) {
	if (arrayJson != 'no_data') {

		arrayJson.forEach(item => {
			if (numeroCampos < 5) {
				const e = document.createElement('div');
				e.className = 'col-xs-6';
				e.innerHTML = `
				<input type="hidden" name="id_campo[]" value="${item.id_campo}">
        		<input class="o_tag col-xs-7" type="text" name="tag[]" value="${item.tag}"> <br>
        		<textarea wrap="off" class="o_content col-xs-11" name="content[]" rows="3">${item.content}</textarea>`;

				camposContainer.appendChild(e);
				numeroCampos++;

			} else { popup.alert({ content: 'Se ha alcanzado el máximo de campos disponibles' }) }
		})
	}
	return numeroCampos;
}

/**-----------------------------OBTENER LOS CAMPOS EXTRA ----------------------*/
async function getCamposExtra(id) {
	let d = new FormData(); d.append('id_orden', id);

	return res = await fetch('ordenes/get-campos/' + id, {
		method: 'GET',
	}).then(response => response.json())
	.then(dataJson => dataJson);
}

/**----------------------LIMPIAR FORMS ORDENES DE SERVICIO --------------*/
function borrarCamposExtra() {
	if (nc_grupo) {
		for (nc_grupo; nc_grupo > 0; nc_grupo--) {
			campos_grupo.lastChild.remove();
		}
	}

	if (nc_banquete) {
		for (nc_banquete; nc_banquete > 0; nc_banquete--) {
			campos_banquete.lastChild.remove();
		}
	}

	if (nc_ceremonia) {
		for (nc_ceremonia; nc_ceremonia > 0; nc_ceremonia--) {
			campos_ceremonia.lastChild.remove();
		}
	}

	if (nc_coctel) {
		for (nc_coctel; nc_coctel > 0; nc_coctel--) {
			campos_coctel.lastChild.remove();
		}
	}
}