const m_evento = document.querySelector('#M_evento');

window.addEventListener('click', (e) => {
	if (e.target === flex || e.target === cerrar) {
		cerrarEvent();
	}
})

function abrirEvent() {
	let body = document.getElementById('body');

	body.setAttribute('style', 'overflow: hidden; padding-right: 17px');
	m_evento.style.display = 'block';
	closeLoading();
}

function cerrarEvent() {
	let body = document.getElementById('body');

	form_evento.reset()
	m_evento.style.display = 'none'
	body.removeAttribute('style');
}
