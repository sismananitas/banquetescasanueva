/**
 * FUNCIONES AL CARGAR
 */
(() => {
	const forms = md_orden.querySelectorAll('form'),
		fondo = md_orden.querySelector('.flex'),
		cerrar = md_orden.querySelector('.close');

	/**---------------------- ESCUCHA EL MODAL ORDENES ----------------*/
	md_orden.addEventListener('click', e => {
		e.preventDefault()
		let formOrden = e.target.parentElement.parentElement,
			formClass = formOrden.className.split(' '),
			btnClass = e.target.className

		/**--------------- BOTÓN AGREGAR --------------*/
		if (btnClass == 'btn success') {
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

		/**-----------------BOTÓN EDITAR -----------------*/
		if (btnClass == 'btn atention') {
			popup.confirm({
				content: 'Confirmar cambios',
				default_btns: {
					ok: 'SÍ', cancel: 'NO'
				}
			},
			(clck) => {
				if (clck.proceed) {
					if (formClass[0] == 'form') {
						enviarFormulario(e.target, forms, editOrden)
					}
				}
			})
		}
	});

	/**-------------- ENVÍA EL FORM ORDENES ---------------*/
	let enviarFormulario = (btn, frms, callback) => {
		let form_id = btn.getAttribute('form');
		form = md_orden.querySelector('#' + form_id);
		callback(form, frms);
	}

	/**----------------------CERRAR MODAL ORDENES --------------------*/
	window.addEventListener('click', (e) => {
		if (e.target == fondo || e.target == cerrar) {
			borrarCamposExtra();
			forms.forEach(item => item.reset());
			md_orden.style.display = 'none';
		}
	});

	/**-------------- MODAL BORRAR ORDEN ------------*/
	const modal_borrar = document.querySelector('#frm_eliminar_orden'),
		fondo_borrar = modal_borrar.querySelector('.flex'),
		frm_borrar = modal_borrar.querySelector('form'),
		cerrar_borrar = modal_borrar.querySelector('#cerrar');

	/**--- CIERRA EL MODAL ---*/
	window.addEventListener('click', (e) => {
		if (e.target == fondo_borrar || e.target == cerrar_borrar) {
			modal_borrar.style.display = 'none';
			frm_borrar.reset();
		}
	});
	/**--- ESCUCHA EL FORMULARIO BORRAR ORDEN ---*/
	frm_borrar.addEventListener('submit', e => {
		e.preventDefault();
		borrarOrden(frm_borrar, modal_borrar);
	})
})();

/**
 * FUNCIONES CRUD
*/

/*-----------------------------AGREGAR ORDEN DE SERVICIO------------------*/
function addOrden(frm, forms) {
	let fecha = document.querySelector('#date_start'),
		formData = new FormData(frm);

	formData.append('accion', 'agregar');
	formData.append('id_evento', e_id.value);
	formData.append('fecha', fecha.value);

	fetch('ordenes/add', {
		method: 'POST',
		body: formData
	})
	.then(response => response.json())
	.catch(error => popup.alert({ content: 'No hay conexión\n' + error }))

	.then(dataJson => {
		if (dataJson.error) {
			throw dataJson;
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

/*----------------- EDITAR ORDEN --------------------------*/
function editOrden(frm, forms) {
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
	.catch(error => popup.alert({ content: 'No hay conexión\n' + error }))
	.then(dataJson => {
		if (dataJson.error) {
			throw dataJson;
		}

		let ord = new FormData();
		ord.append('id', e_id.value)

		obtenerOrdenes(ord)
			.then(dataJson => {
				let results = dataJson.length;

				if (results <= 0)
					console.log('No hay ordenes', dataJson.length);

				mostrarOrdenes(dataJson);
			})
		md_orden.style.display = 'none';
		borrarCamposExtra();
		forms.forEach(item => item.reset());
	})
	.catch(error => {
		popup.alert({ content: error.msg });
	})
}

/*-------------------------BORRAR ORDEN----------------------*/
function borrarOrden(form_orden, modal) {
	let Datos = new FormData(form_orden);

	Datos.append('id_evento', e_id.value);
	Datos.append('accion', 'eliminar');

	/** PIDE BORRAR EL REGISTRO */
	fetch('ordenes/del', {
		method: 'POST',
		body: Datos
	})
	.then(response => response.json())
	.catch(error => popup.alert({ content: 'No hay conexión\n' + error }))

	.then(dataJson => {
		if (dataJson.error) {
			throw dataJson;
		}

		/** ACTUALIZA LOS REGISTROS EN LA TABLA */
		let ord = new FormData();
		ord.append('id', e_id.value);
		obtenerOrdenes(ord)
			.then(dataJson => {
				let results = dataJson.length;

				if (results <= 0)
					console.log('No hay ordenes', dataJson.length);
				mostrarOrdenes(dataJson);
			})
		modal.style.display = 'none';

	})
	.catch(error => {
		popup.alert({ content: error.msg });
	})
}

/**-----------------------------OBTENER LOS CAMPOS EXTRA ----------------------*/
async function getCamposExtra(id) {
	let d = new FormData(); d.append('id_orden', id);

	return res = await fetch('ordenes/get-campos/' + id, {
		method: 'GET',
	}).then(response => response.json())
	.then(dataJson => dataJson);
}

/**-----------------------------PINTAR CAMPOS EXTRA FORM -----------------------*/
function pintarCampos(arrayJson, camposContainer, numeroCampos) {
	if (arrayJson != 'no_data') {

		arrayJson.forEach(item => {
			if (numeroCampos < 5) {
				const e = document.createElement('div');
				e.className = 'col-xs-6';
				e.innerHTML = `<input type="hidden" name="id_campo[]" value="${item.id_campo}">
        <input class="o_tag col-xs-7" type="text" name="tag[]" value="${item.tag}"> <br>
        <textarea wrap="off" class="o_content col-xs-11" name="content[]" rows="3">${item.content}</textarea>`;

				camposContainer.appendChild(e);
				numeroCampos++;

			} else { popup.alert({ content: 'Se ha alcanzado el máximo de campos disponibles' }) }
		})
	}
	return numeroCampos;
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