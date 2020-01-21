const ms_flex = M_sesion.querySelector('.flex'),
	ms_close = M_sesion.querySelector('.close');

window.addEventListener('click', (e) => {
	if (e.target == ms_flex || e.target == ms_close) {
		M_sesion.style.display = 'none';
		form_sesion.reset();
	}
})

const openMSesion = () => {
	M_sesion.style.display = 'block';
	M_sesion.querySelectorAll('input')[0].focus();
}

const closeMSesion = () => { M_sesion.style.display = 'none'; form_sesion.reset(); }