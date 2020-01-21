
/** Modal BORRAR logistica */
(() => {
	const bg = f_eliminar_log.querySelector('.flex'),
		frm_borrar = f_eliminar_log.querySelector('form'),
		close = f_eliminar_log.querySelector('.cerrar');

	const mdl_close = md_logistica.querySelector('.close'),
		fondo_mdl = md_logistica.querySelector('.flex');

	window.addEventListener('click', (e) => {
		if (e.target == bg || e.target == close) {
			f_eliminar_log.style.display = 'none';
			frm_borrar.reset();
		}

		if (e.target == fondo_mdl || e.target == mdl_close) {
			md_logistica.style.display = 'none'
			form_logistica.reset();
		}
	})

})();