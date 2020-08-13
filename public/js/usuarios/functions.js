const UserControllerUrl = 'usuarios/';

/**
 * MUESTRA EL MODAL USUARIO
 */
function showModalUser(e) {
    modal_usuarios.style.display = 'block';
    btn_reg.style.display = 'block';
    btn_act.style.display = 'none';
    form_usuario.querySelector('.div-pass').style.display = 'block';
}

/**
 * Envía el formulario Store User por AJAX
 * 
 * @param {event} e Object
 */
function sendFormStoreUser(e) {
    let formdata = new FormData(form_usuario);

    fetch(UserControllerUrl + 'add', {
        method: 'POST',
        body: formdata
    })
    .then(response => response.json())
    .then(dataJson => {
        if (dataJson.error) {
            popup.alert({content: dataJson.msg});
            return 0;
        }
        
        popup.alert({ content: 'Se ha creado el usuario' });
        modal_usuarios.style.display = 'none';
        form_usuario.reset();
        location.reload();
    })
    e.preventDefault()
}

/**
 * Envía el formulario para editar usuario
 * 
 * @param {event} e Object
 */
function sendFormUpdateUser(e) {
    popup.confirm({
        content: 'Confirmar cambios', effect: 'bottom'
    },
    (clck) => {
        if (clck.proceed) {
            let formdata = new FormData(form_usuario);
            
            fetch(UserControllerUrl + 'edit', {
                method: 'POST',
                body: formdata
            })
            .then(response => response.json())
            .then(dataJson => {
                if (dataJson.error) {
                    throw dataJson;
                }
                modal_usuarios.style.display = 'none';
                form_usuario.reset();
                location.reload();
            })
            .catch(error => {
                popup.alert({content: error.msg});
            })
        }
    })
}

/**
 * Muestra el modal para actualizar un usuario
 * 
 * @param {event} e Object
 */
function showModalEditUser(e) {
    let btn = e.target.className,
        id = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;

    btn_reg.style.display = 'none';
    btn_act.style.display = 'block';
    
    fetch(UserControllerUrl + 'get-one/' + id)
    .then(response => response.json())
    .then(dataJson => {
        printModalUsuario(dataJson[0]);
    })
}

/**
 * Muestra alerta antes de borrar el usuario
 * 
 * @param {event} e Object
 */
function showAlertDeleteUser(e) {
    const btn = e.target.className,
        id = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;

    popup.confirm({
        content: '<b>Eliminar</b><br><br>¿Está seguro?',
        default_btns: {
            ok: 'SÍ',
            cancel: 'NO'
        }
    },
    (clk) => {
        if (clk.proceed) {
            let formdata = new FormData();
            formdata.append('id', id);
            
            /** PIDE ELIMINAR EL USUARIO */
            fetch(UserControllerUrl + 'del', {
                method: 'POST',
                body: formdata
            })
            .then(response => response.json())
            .then(dataJson => {
                if (dataJson.error) {
                    popup.alert({ content: dataJson.msg});
                    return 0;
                }
                location.reload();
            })
        }
    })
}

addEventListener('DOMContentLoaded', () => {
    /** CIERRAR EL MODAL USUARIO */
    const modalUsu = new Modal(modal_usuarios);
    tabla_usu = new FormData();
    
    window.addEventListener('click', (e) => {
        if (e.target == modalUsu.fondo || e.target == modalUsu.btn_close) {
            form_usuario.reset();
            modal_usuarios.style.display = 'none';
        }
    })
})

function obtenerDatosDonde(tabla, campo, valor) {
    let data = new FormData();
    data.append('tabla', tabla);
    data.append('campo', campo);
    data.append('valor', valor);

    return res = fetch('core/ajax/verRegistro.php', {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
}

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