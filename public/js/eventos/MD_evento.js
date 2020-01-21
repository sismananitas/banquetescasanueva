addEventListener('DOMContentLoaded', () => {
	const md_fondo = MD_evento.querySelector('.flex'),
	btn_cancelar = cancelar,
	btn_nueva_log = MD_evento.querySelector('#btnAgregarLogistica'),
	btn_nueva_orden = MD_evento.querySelector('#btn_agregar_orden'),
	cerrar = MD_evento.querySelector('.close'),
	tb_ordenes = MD_evento.querySelector('#tbody_orden');

	/***------------------ MODAL DETALLE EVENTO ---------------***/
	md_fondo.addEventListener('click', (e) => {
		if (e.target == md_fondo || e.target == cerrar || e.target == btn_cancelar) {
			MD_evento.style.display = 'none';
		}
	})

	/**--------------- BOTONES MODALES LOGÍSTICA Y ORDENES ---------*/
	btn_nueva_log.addEventListener('click', abrirAgregarLogistica);
	btn_nueva_orden.addEventListener('click', abrirAgregarOrden);

	/**---------------- ESCUCHA LA TABLA LOGÍSTICA ----------------*/
	tb_logistica.addEventListener('click', (e) => {
		let btn = e.target,
			btnClass = btn.className,
			id_btn = btn.getAttribute('element');

		/** BOTÓN EDITAR */
		if (btnClass == 'atention') {
			abrirEditarLogistica(id_btn);
		}

		/** BOTÓN ELIMINAR */
		if (btnClass == 'danger') {
			f_eliminar_log.style.display = 'block';
			id_elim_log.value = id_btn;
		}
	})

	/**--------------- ESCUCHA LA TABLA ORDENES ---------------*/
	tb_ordenes.addEventListener('click', (e) => {

		const btns_add = md_orden.querySelectorAll('.success'),
			btns_edit = md_orden.querySelectorAll('.atention'),
			btns_ext = md_orden.querySelectorAll('.primary')

		let btn = e.target,
			btnClass = btn.className,
			id_btn = btn.getAttribute('orden');

		/** BOTÓN EDITAR */
		if (btnClass == 'atention') {
			btns_add.forEach(b => b.style.display = 'none')
			btns_edit.forEach(b => b.style.display = 'block')
			btns_ext.forEach(b => b.style.display = 'none')
			openModalOrdenes(id_btn)
		}

		/** BOTÓN ELIMINAR */
		if (btnClass == 'danger') {
			let inp = frm_eliminar_orden.querySelector('input');

			inp.value = id_btn;
			frm_eliminar_orden.style.display = 'block';
		}

		if (btnClass == 'btn primary') {
			let orden_id = btn.parentElement.parentElement.dataset.item,
			dataReq = new FormData();
			url = 'ordenes/clone';

			dataReq.append('orden_id', orden_id);
			ajaxRequest(url, dataReq)
			.then(dataJson => {
				if (dataJson.error) {
					throw dataJson;
				}

				/** ACTUALIZA LOS REGISTROS EN LA TABLA */
				let ord = new FormData();
				ord.append('id', e_id.value);
				obtenerOrdenes(ord)
					.then(ordenesJson => {
						let results = ordenesJson.length;

						if (results <= 0)
							console.log('No hay ordenes', ordenesJson.length);
						mostrarOrdenes(ordenesJson);
					})
			})
			.catch(error => {
				popup.alert({ content: 'Error: ' + error.msg });
			})
		}
	})
})