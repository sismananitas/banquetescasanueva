/**
 * Escucha el click en el botón "detalle evento" del formulario
 */
addEventListener('DOMContentLoaded', () => {
	const flex = M_evento.querySelector('.flex'),
		close = M_evento.querySelector('.cerrar');
	let body = document.getElementById('body');

	btnDetalleEvento.addEventListener('click', e => abrirDetalleEvento());

	/** ESCUCHA EL FONDO */
	window.addEventListener('click', (e) => {
		if (e.target === flex || e.target === close) {
			form_evento.reset();
			M_evento.style.display = 'none';
			body.removeAttribute('style');
		}
	});

	/** BTN MODIFICAR */
	btnModificar.addEventListener('click', () => {
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
		});
	})

	/** BTN BORRAR */
	btnBorrar.addEventListener('click', () => {
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
		});
	});
});

function getTipoEventos() {

	getFetch('tipo-eventos/get-all')
	.then(dataJson => {
		text = `<option value="${dataJson[0].nombre_tevento}">- Elegir -</option>`;

		for (i in dataJson) {
			t = dataJson[i];
			text += `<option value="${t.nombre_tevento}">${t.nombre_tevento}</option>`;
		}
		e_evento.innerHTML = text;
	})
}