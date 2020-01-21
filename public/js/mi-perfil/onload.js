
/** -------------------------------CONSTANTES DE CONFIGUARCIÓN----------------------------- */

const controller = 'mi_perfil/'; // SERVICIO PHP CON EL QUE SE TRABAJA EN ESTE ARCHIVO
const modal_detalle = new Modal(m_detalle);
let form_pass = document.getElementById('form_pass');

loadTable();

/**------------------------ TABLA DETALLE DEL USUARIO ------------------*/
function loadTable() {

	/** PIDE LOS DATOS AL SERVIDOR */
	fetch(controller + 'get-my-info', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"Cache-Control": "no-cache, must-revalidate",
      		"Pragma": "no-cache"
		}
	})
		.then(response => response.json())
		.then(dataJson => {
			if (dataJson.error) {
				popup.alert({ content: '<b>Ocurrio un error</b><br><br>' + dataJson.msg })
				console.log(dataJson)

			} else {
				/** CARGA LOS DATOS EN LA TABLA DETALLE */
				loadUserTable(dataJson.data)
			}
		})
}

/**------------------- FORMULARIO DE CAMBIO DE CONTRASEÑA ---------------*/

form_pass.addEventListener('submit', (e) => {
	e.preventDefault();
	let d = new FormData(form_pass); // EMPAQUETA LOS DATOS DEL FORMLUARIO CAMBIO DE CONTRASEÑA

	/** PIDE EL CAMBIO DE CONTRASEÑA AL SERVIDOR */
	fetch(controller + 'new-pass', {
		method: 'POST',
		body: d,
		headers: {
			"Cache-Control": "no-cache, must-revalidate",
      		"Pragma": "no-cache"
		}
	})
		.then(response => response.json())
		.then(dataJson => {
			if (dataJson.error) {
				throw dataJson;
			}
			popup.alert({ content: 'Su contraseña se ha actualizado' });
			form_pass.reset();
		})
		.catch(dataJson => {
			popup.alert({ content: dataJson.msg })
		})
})

/**------------------------ MODAL DETALLE DE USUARIO ------------------*/

/** ESCUCHA EL CLIC DEL BOTÓN EDITAR */
btn_detalle.addEventListener('click', e => {
	e.preventDefault();
	let body = document.getElementById('body');

	/** BUSCA LOS DATOS EN EL SERVIDOR */
	fetch(controller + 'get-my-info')
		.then(response => response.json())
		.then(dataJson => {

			if (dataJson.error) {
				popup.alert({ content: '<b>Ocurrio un error</b><br><br>' + dataJson.msg })
				console.log(dataJson)

			} else {
				/** CARGA LOS DATOS EN EL FORMULARIO */
				loadUserForm(dataJson.data)
			}
			/** ABRE EL MODAL */
		}).then(() => {
			modal_detalle.abrir();
			body.setAttribute('style', 'overflow: hidden; margin-right: 17px');
		})
})

addEventListener('click', e => {
	let body = document.getElementById('body');
	if (e.target === modal_detalle.fondo || e.target === modal_detalle.btn_close) {
		modal_detalle.cerrar();
		body.removeAttribute('style');
	}
})

/**------------------------- FORMULARIO DETALLE USUARIO -------------------*/

form_detalle_user.addEventListener('submit', e => {
	e.preventDefault();
	let dataForm = new FormData(form_detalle_user); // EMPAQUETA LOS DATOS DEL FORMULARIO DETALLE USUARIO

	/** PIDE LA ACTUALIZACIÓN DE LOS DATOS AL SERVIDOR */
	fetch(controller + 'actualizar', {
		method: 'POST',
		body: dataForm
	})
	.then(response => response.json())
	.then(dataJson => {
		if (dataJson.error) {
			popup.alert({ content: dataJson.msg });

		} else {
			modal_detalle.cerrar()
			form_detalle_user.reset();
			loadTable();
		}
	})
})