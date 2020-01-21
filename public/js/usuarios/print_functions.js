
/** PINTAR MODAL USUARIO */
function printModalUsuario(user) {
    let item = user,
    m_input  = form_usuario.querySelectorAll('input'),
    select   = form_usuario.querySelectorAll('select');
    // Se cargan los datos al formulario
    m_input[0].value                  = item.id;
    m_input[1].value                  = item.username;
    select[0].firstElementChild.value = item.nivel;
    select[1].firstElementChild.value = item.estado;
    modal_usuarios.style.display      = 'block';
    form_usuario.querySelector('.div-pass').style.display = 'none';
}