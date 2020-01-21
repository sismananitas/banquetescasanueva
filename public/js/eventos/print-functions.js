
/**----------------- PINTAR TABLA LOGÍSTICA --------------------*/
function mostrarLogistica(data) {
	tb_logistica.innerHTML = '';	

	for (let val of data) {
		let fechahora = val.start.split(' ', 2),
		date_format = fechahora[0];

		tb_logistica.innerHTML += `<tr>
		<td>${date_format}</td>
		<td>${fechahora[1]}</td>
		<td>${val.title}</td>
		<td>${val.lugar}</td>
		<td>
		<button class="atention" type="button" element="${val.id_sub_evento}">
		<i class="fas fa-pen-alt"></i>
		</button>
		<button class="danger" type="button" element="${val.id_sub_evento}">
		<i class="fas fa-trash"></i>
		</button>
		</td>
		</tr>`;
	}
}

/**----------------- PINTAR TABLA ORDENES ------------------*/
function mostrarOrdenes(data) {
	tbody_orden.innerHTML = '';

	for (let val of data) {
		let fechahora = val.fecha.split(' ', 2),
		date_format = fechahora[0];

		tbody_orden.innerHTML += `<tr data-item="${val.id_orden}">
		<td>
		<a class="btn atention" href="ordenes/print/${val.id_orden}" target="_blank" title="ver PDF">
		<i class="fas fa-print"></i>
		</a>
		<button id="btn_clonar_orden" class="btn primary" style="margin-top: 4px;" title="clonar">
		Duplicar
		</button>
		</td>
		<td>${val.orden}</td>
		<td>${val.lugar}</td>
		<td>${date_format}</td>
		<td>
		<button class="atention" type="button" orden="${val.id_orden}">
		<i class="fas fa-pen-alt"></i>
		</button>
		<button class="danger" type="button" orden="${val.id_orden}">
		<i class="fas fa-trash"></i>
		</button>
		</td>
		</tr>`;
	}
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