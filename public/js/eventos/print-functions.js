
function newPrintModalEvento(event) {
	let templateForm = ''

	let fechaHora_start  = event.start._i.split(" ")
	let fechaHora_end = event.end._i.split(" ")

	let date_start = fechaHora_start[0]
	let time_start = fechaHora_start[1]
	
	let date_end = fechaHora_end[0]
	let time_end = fechaHora_end[1]

	templateForm = `
	<input id="e_id" type="hidden" name="id" value="${event.id_evento}">
	<div class="row-between">
		<div class="col-xs-12 col-sm-6">
			Titulo *<br>
			<input id="e_title" class="col-xs-12 col-sm-11" type="text" name="title" value="${event.title}" required>
			<div class="row-between col-xs-12 col-sm-11">
				<div class="col-xs-6">
					Evento *<br>
					<input id="e_evento" class="col-xs-12 col-sm-11" type="text" name="evento" value="${event.evento}" required>
				</div>
				<div class="col-xs-6">
					Personas *<br>
					<input id="personas" class="col-xs-12" type="number" name="personas" value="${event.personas}" required>
				</div>
				<div class="col-xs-6">
					Fecha<br>
					<input
						id="date_start"
						class="col-xs-12 col-sm-11 line-block"
						type="date" min="1900-04-01" value="${date_start}"
					>
					<br>
					Hora inicio<br>
					<input id="time" class="col-xs-12 col-sm-11 line-block" type="time" value="${time_start}"><br>
				</div>
				<div class="col-xs-6">
					Fecha final<br>
					<input id="date_end" class="col-xs-12" type="date" value="${date_end}"><br>
					Hora final<br>
					<input id="time_f" class="col-xs-12" type="time" value="${time_end}"><br>
				</div>
				<div class="col-xs-6">
					Status
					<a id="e_status" class="pill">${event.status}</a><br>
					<select
						id="color"
						class="col-xs-12 col-sm-11"
						name="color"
					>
						<option id="old_color" value="#d7c735">- Elegir -</option>
						<option
							value="#d7c735" `

		templateForm += event.color == "#d7c735" ? `selected` : ``

		templateForm +=	`>Tentativo</option>
						<option
							value="#f98710" `

		templateForm +=	event.color == "#f98710" ? `selected` : ``

		templateForm += `>Apartado</option>
						<option
							value="#54b33d" `

		templateForm +=	event.color == "#54b33d" || event.color == '#E56285' ? `selected` : `` || event.color == '#a35018' ? 'selected' : ''

		templateForm += `>Cerrado</option>
					</select>
				</div>
				<div class="col-xs-6">
					Categoria
					<a id="txtcategoria" class="pill">${event.categoria}</a><br>
					<select id="categoria" class="col-xs-12" name="categoria" value="${event.categoria}">
						<option id="idcategoria" value="">- Seleccionar -</option>
						<option
							value="Social"`
		templateForm += event.categoria == 'Social' ? `selected` : ''
		templateForm += `> Social </option>`

		templateForm += `<option
							value="Empresarial"`
		templateForm += event.categoria == 'Empresarial' ? `selected` : ''
		templateForm += `> Empresarial </option>`

		templateForm += `<option
							value="Casa"`
		templateForm += event.categoria == 'Casa' ? `selected` : ''
		templateForm += `> Casa </option>
					</select>
				</div>
			</div>
		</div>
		<div class="col-xs-12 col-sm-6">
			Cliente *<br>
			<input id="e_contacto" class="col-xs-12" type="text" name="contacto" value="${event.contacto}">
			<div class="row-between">
				<div class="col-xs-6">
					<label id="cord_resp">Responsable *</label><br>
					<input id="e_cord_resp" class="col-xs-12 col-sm-11" type="text" name="cord_resp" value="${event.cord_resp}">
				</div>
				<div class="col-xs-6">
					Cord. Apoyo<br>
					<input id="e_cord_apoyo" class="col-xs-12" type="text" name="cord_apoyo" value="${event.cord_apoyo}">
				</div>
			</div>
			<div class="row-between">
				<div class="col-xs-6">
					<label for="id_lugar">Salón</label>
					<a id="e_place" class="pill">${event.lugar}</a>
					<select id="id_lugar" class="col-xs-12 col-sm-11" name="lugar" value="${event.id_lugar}">
					</select>
				</div>
				<div class="col-xs-6">
					Folio Front2Go <br>
					<input id="e_folio" class="col-xs-12" type="text" name="folio" placeholder="Agregar" value="${event.folio}">
				</div>
			</div>
			Observaciones<br>
			<textarea id="e_description" class="col-xs-12" name="description" rows='3'>${event.description}</textarea>
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
			<input id="e_title" class="col-xs-12 col-sm-11" type="text" name="title" required>
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
					<input id="date_start" class="col-xs-12 col-sm-11 line-block" type="date" min="1900-04-01" value="${date.format('YYYY-MM-DD')}"><br>
					Hora inicio<br>
					<input id="time" class="col-xs-12 col-sm-11 line-block" type="time" value="00:00:00"><br>
				</div>
				<div class="col-xs-6">
					Fecha final<br>
					<input id="date_end" class="col-xs-12" type="date" value="${date.format('YYYY-MM-DD')}"><br>
					Hora final<br>
					<input id="time_f" class="col-xs-12" type="time" value="23:00:00"><br>
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
						<option value="">- Seleccionar -</option>
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
					<input id="e_cord_resp" class="col-xs-12 col-sm-11" type="text" name="cord_resp">
				</div>
				<div class="col-xs-6">
					Cord. Apoyo<br>
					<input id="e_cord_apoyo" class="col-xs-12" type="text" name="cord_apoyo">
				</div>
			</div>
			<div class="row-between">
				<div class="col-xs-6">
					<label for="id_lugar">Salón</label>
					<a id="e_place" class="pill"></a>
					<select id="id_lugar" class="col-xs-12 col-sm-11" name="lugar">
						<!-- js -->
					</select>
				</div>
				<div class="col-xs-6">
					Folio Front2Go <br>
					<input id="e_folio" class="col-xs-12" type="text" name="folio" placeholder="Agregar">
				</div>
			</div>
			Observaciones<br>
			<textarea id="e_description" class="col-xs-12" name="description" rows='3'></textarea>
		</div>
	</div>`
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
async function printModalOrden(dataOrden) {
	const ord = dataOrden	

	let mdl = document.getElementById('md_orden'),
		tabs = mdl.querySelectorAll('.tab')

	let id_orden 	  = mdl.querySelectorAll('.id_orden'),
		evento 	 	  = mdl.querySelectorAll('.o_nombre'),
		place 	 	  = mdl.querySelectorAll('.o_place'),
		montaje  	  = mdl.querySelectorAll('.o_montaje'),
		garantia 	  = mdl.querySelectorAll('.o_garantia'),
		hora 	 	  = mdl.querySelectorAll('.o_hora'),
		canapes  	  = mdl.querySelectorAll('.o_canapes'),
		entrada  	  = mdl.querySelectorAll('.o_entrada'),
		fuerte 	 	  = mdl.querySelectorAll('.o_fuerte'),
		postre 	 	  = mdl.querySelectorAll('.o_postre'),
		torna 	 	  = mdl.querySelectorAll('.o_torna'),
		bebidas  	  = mdl.querySelectorAll('.o_bebidas'),
		aguas 	 	  = mdl.querySelector('.o_aguas_frescas'),
		cocteleria    = mdl.querySelectorAll('.o_cocteleria'),
		mezcladores   = mdl.querySelectorAll('.o_mezcladores'),
		dmontaje 	  = mdl.querySelectorAll('.o_dmontaje'),
		ama_llaves    = mdl.querySelectorAll('.o_ama_llaves'),
		chief_steward = mdl.querySelectorAll('.o_chief_steward'),
		mantenimiento = mdl.querySelectorAll('.o_mantenimiento'),
		seguridad 	  = mdl.querySelectorAll('.o_seguridad'),
		rh 			  = mdl.querySelectorAll('.o_RH'),
		proveedores   = mdl.querySelectorAll('.o_proveedores'),
		contabilidad  = mdl.querySelectorAll('.o_contabilidad'),
		formularios   = mdl.querySelectorAll('form'),
		observaciones = mdl.querySelectorAll('.o_observaciones')

	/** Da click a la pestaña con el mismo formato */
	tabs.forEach(tab => {
		if (tab.innerHTML.toLowerCase() === ord.tipo_formato)
			tab.click()
	})

	tabs.forEach(tab => {
		tab.style.pointerEvents = 'none';
		tab.style.color = '#5f5f5f';
	})

	for (let j = 0; j < 4; j++) {
		let fechahora = ord.fecha.split(' ')

		id_orden[j].value 	   = ord.id_orden
		evento[j].value   	   = ord.orden
		garantia[j].value 	   = ord.garantia
		place[j].value 	 	   = ord.lugar
		montaje[j].value 	   = ord.montaje
		hora[j].value 	 	   = fechahora[1]
		dmontaje[j].value 	   = ord.detalle_montaje
		ama_llaves[j].value    = ord.ama_llaves
		mantenimiento[j].value = ord.mantenimiento
	}

	switch (ord.tipo_formato) {
		case 'ceremonia':
			observaciones[1].value = ord.observaciones
			seguridad[0].value     = ord.seguridad
			rh[0].value 		   = ord.recursos_humanos
			proveedores[0].value   = ord.proveedores

			await getCamposExtra(ord.id_orden)
			.then(res => {
				nc_ceremonia = pintarCampos(res.data, campos_ceremonia, nc_ceremonia)
			})
			break;

		case 'grupo':
			canapes[0].value 	   = ord.canapes
			observaciones[0].value = ord.observaciones
			contabilidad[0].value  = ord.contabilidad
			chief_steward[0].value = ord.chief_steward
			bebidas[0].value 	   = ord.bebidas

			await getCamposExtra(ord.id_orden)
			.then(res => {
				nc_grupo = pintarCampos(res.data, campos_grupo, nc_grupo)
			})
			break;

		case 'coctel':
			canapes[1].value 	   = ord.canapes
			cocteleria[0].value    = ord.cocteleria
			bebidas[1].value 	   = ord.bebidas
			aguas.value 	 	   = ord.aguas_frescas
			seguridad[1].value 	   = ord.seguridad
			rh[1].value 	 	   = ord.recursos_humanos
			proveedores[1].value   = ord.proveedores
			contabilidad[1].value  = ord.contabilidad
			chief_steward[1].value = ord.chief_steward
			cocteleria[0].value    = ord.cocteleria
			mezcladores[0].value   = ord.mezcladores
			observaciones[2].value = ord.observaciones

			await getCamposExtra(ord.id_orden)
			.then(res => {
				nc_coctel = pintarCampos(res.data, campos_coctel, nc_coctel)
			})
			break;

		case 'banquete':
			entrada[0].value 	   = ord.entrada
			fuerte[0].value 	   = ord.fuerte
			postre[0].value 	   = ord.postre
			torna[0].value 		   = ord.torna
			seguridad[2].value     = ord.seguridad
			rh[2].value 		   = ord.recursos_humanos
			proveedores[2].value   = ord.proveedores
			contabilidad[2].value  = ord.contabilidad
			chief_steward[2].value = ord.chief_steward
			bebidas[2].value 	   = ord.bebidas
			mezcladores[1].value   = ord.mezcladores
			observaciones[3].value = ord.observaciones

			await getCamposExtra(ord.id_orden)
			.then(res => {
				nc_banquete = pintarCampos(res.data, campos_banquete, nc_banquete)
			})
			break;
	}
}

/** MODAL DETALLE DE LA ORDEN DE SEVICIO */
/**-----------------------------PINTAR CAMPOS EXTRA FORM -----------------------*/
function pintarCampos(arrayJson, camposContainer, numeroCampos) {
	camposContainer.innerHTML = ''
	numeroCampos = 0
	if (arrayJson != 'no_data') {

		arrayJson.forEach(item => {
			if (numeroCampos < 5) {
				const e = document.createElement('div');
				e.className = 'col-xs-6';
				e.innerHTML = `
				<input type="hidden" name="id_campo[]" value="${item.id_campo}">
        		<input class="o_tag col-xs-7" type="text" name="tag[]" value="${item.tag}"><br>
        		<textarea wrap="off" class="o_content col-xs-11" name="content[]" rows="3">${item.content}</textarea>`

				camposContainer.appendChild(e);
				numeroCampos++;

			} else { swal.fire('Se ha alcanzado el máximo de campos disponibles') }
		})
	}
	return numeroCampos;
}

/**-----------------------------OBTENER LOS CAMPOS EXTRA ----------------------*/
function getCamposExtra(id) {
	return axios.get('ordenes/get-campos/' + id)
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