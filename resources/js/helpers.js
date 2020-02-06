const w = window

w.formato_moneda  = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    minimumIntegerDigits: 1
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
	console.log('Open modal');
	
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

w.tabs = (element) => {
    const tabs = document.querySelector(element);

    /* Escucha el click sobre las tabs */
    tabs.addEventListener('click', (e) => {
        e.preventDefault();
        let tab = tabs.querySelectorAll('.tab');

        /* Se obtiene el tab seleccionado y su apuntador */
        let tab_selected = e.target,
        getHash = '';

        if (tab_selected.hasAttribute('href')) {
            getHash = tab_selected.getAttribute('href');

            /* Se obtienen todos los contenidos de los tabs y el contenido seleccionado */
            let tab_content      = tabs.querySelectorAll('.tab_content'),
            tab_content_selected = tabs.querySelector(getHash);
            
            /* Se recorren las tabs y se cambia su atributo class */
            for ( let i in tab ) {
                tab[i].className         = 'tab';
                tab_content[i].className = 'tab_content';           
            }            
            tab_selected.className         = 'tab active';
            tab_content_selected.className = 'tab_content show';
        }
    })
}

w.showToast = (message, type = 'success') => {
    swal.fire({
        toast: true,
        icon: type,
        title: message,
        position: 'top-right',
        timer: 3000,
        showConfirmButton: false
    })
}