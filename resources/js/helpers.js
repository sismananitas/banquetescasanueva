const w = window

w.formato_moneda  = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    minimumIntegerDigits: 2
};

w.MESES = [
   "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

w.meses = [
   "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

function stopPropagation(e) {
   e.stopPropagation()
}

w.stopPropagation = stopPropagation

function openModal(modalId) {
	let body = document.getElementById('body')
	let modal = document.getElementById(modalId)

	body.setAttribute('style', 'overflow: hidden; padding-right: 17px')
	modal.style.display = 'block'
}

w.openModal = openModal

/**
 * Cierra una ventana modal
 * @param {object} e Event handler
 * @param {string} modalId Modal to lose
 * @param {string} formId Form to reset
 */
function cerrarModal(e, modalId, formId = null) {
	let body = document.getElementById('body')
	let m    = document.getElementById(modalId)

	if (formId) {
		let f = document.getElementById(formId)
		f.reset()
	}

	m.style.display = 'none'
	body.removeAttribute('style')
}

w.cerrarModal = cerrarModal

/**
 * Cierra una ventana submodal
 * @param {object} e Event handler
 * @param {string} modalId Modal to lose
 * @param {string} formId Form to reset
 */
function cerrarSubModal(e, modalId, formId = null) {
	let m = document.getElementById(modalId)

	if (formId) {
		let f = document.getElementById(formId)
		f.reset()
	}

	m.style.display = 'none'
}

w.cerrarSubModal = cerrarSubModal

let $load_baner = document.createElement('DIV')
$load_baner.className = 'loader-container'
$load_baner.id        = 'loader'
$load_baner.style     = 'display: none'
$load_baner.innerHTML = `<div class="loader">Loading...</div>`
document.querySelector('body').appendChild($load_baner)
  
w.openLoading = () => loader.style.display = 'flex'
w.closeLoading = () => loader.style.display = 'none'