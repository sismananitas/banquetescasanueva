require('./bootstrap')
require('./helpers')
require('./deprecated')

/**
 * Sesión
 */
window.cerrarSesion = () => {
	window.location.href = 'sesion/cerrar';
}

/**
 * navbar
 */
function toggleCollapseMenu(e, navbarId) {
    const navbar = document.getElementById(navbarId)
    if (navbar.classList.value) {
        navbar.classList.toggle('animate-nav-out')
    }
    navbar.classList.toggle('animate-nav-in')
}
window.toggleCollapseMenu = toggleCollapseMenu
 
/**
 * Aplica el navbar colapsable en pantallas responsive
 */
$(window).on('resize', function () {
    let navbar = document.getElementById('main_navbar')
    if ($(this).width() > 900 && navbar.classList.value !== '') {
        navbar.classList.remove('animate-nav-in');
        navbar.classList.remove('animate-nav-out');
    }
})