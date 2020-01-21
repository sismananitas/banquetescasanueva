
const controller = 'usuarios/';

addEventListener('DOMContentLoaded', () => {
    // VARIABLES
    const modalUsu = new Modal(modal_usuarios);
    tabla_usu = new FormData();

    /** BTN AGREGAR USUARIO */
    btn_add_usuarios.addEventListener('click', (e) => {
        modal_usuarios.style.display = 'block';
        btn_reg.style.display = 'block';
        btn_act.style.display = 'none';
        form_usuario.querySelector('.div-pass').style.display = 'block';
    });
    
    /** CIERRAR EL MODAL USUARIO */
    window.addEventListener('click', (e) => {
        if (e.target == modalUsu.fondo || e.target == modalUsu.btn_close) {
            form_usuario.reset();
            modal_usuarios.style.display = 'none';
        }
    });

    /** ESCUCHA EL FORMULARIO DE USUARIOS */
    form_usuario.addEventListener('submit', (e) => {
        e.preventDefault();
        let formdata = new FormData(form_usuario);

        /** PIDE AGREGAR UN USUARIO */
        fetch(controller + 'add', {
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
        });
    })

    /** ESCUCHA LA TABLA DE USUARIOS */
    tbody_usuarios.addEventListener('click', (e) => {
        const btn = e.target.className,
        id = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
    
        /** BTN ACTUALIZAR USUARIO */
        if (btn == 'btn atention') {
            btn_reg.style.display = 'none';
            btn_act.style.display = 'block';
            
            fetch(controller + 'get-one/' + id)
            .then(response => response.json())
            .then(dataJson => {
                printModalUsuario(dataJson[0]);
            })
        }
        
        /** BTN BORRAR USUARIO */
        if (btn == 'btn danger') {
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
                    fetch(controller + 'del', {
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
            });
        }
    })

    /** FORMULARIO ACTUALIZAR USUARIO */
    btn_act.addEventListener('click', e => {
        popup.confirm({
            content: 'Confirmar cambios', effect: 'bottom'
        },
        (clck) => {
            if (clck.proceed) {
                let formdata = new FormData(form_usuario);

                /** PIDE ACTUALIZAR EL USUARIO */
                fetch(controller + 'edit', {
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
    })
})