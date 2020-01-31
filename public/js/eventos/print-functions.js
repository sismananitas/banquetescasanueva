
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
	const ord = dataOrden;

	let mdl = document.getElementById('md_orden'),
		tabs = mdl.querySelectorAll('.tab');

		id_orden = mdl.querySelectorAll('.id_orden'),
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
		observaciones = mdl.querySelectorAll('.o_observaciones');

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
				nc_ceremonia = pintarCampos(res, campos_ceremonia, nc_ceremonia);
			});
			break;

		case 'grupo':
			canapes[0].value = ord.canapes;
			observaciones[0].value = ord.observaciones;
			contabilidad[0].value = ord.contabilidad;
			chief_steward[0].value = ord.chief_steward;
			bebidas[0].value = ord.bebidas;

			getCamposExtra(ord.id_orden).then(res => {
				nc_grupo = pintarCampos(res, campos_grupo, nc_grupo);
			});
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
				nc_coctel = pintarCampos(res, campos_coctel, nc_coctel);
			});
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
				nc_banquete = pintarCampos(res, campos_banquete, nc_banquete);
			});
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