const w = window

async function peticionAjax(url, formData) {
    let fullUrl = url
    let myHeaders = {
        "X-Requested-With": "XMLHttpRequest",
        //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
    return result = await fetch(fullUrl, {
        method: 'POST',
        body: formData,
        headers: myHeaders
    })
    .then(response => response.json())
    .catch(error => {
        popup.alert({ content: 'Hubo un error: ' + error.message })
    })
}
w.peticionAjax = peticionAjax
 
async function getFetch(url) {
    let getHeaders = new Headers({
        "Cache-Control": "no-cache, must-revalidate",
        "Pragma": "no-cache"
    })
    return result = await fetch(url, {
        headers: getHeaders
    })
    .then(response => response.json())
    .catch(error => {
        popup.alert({ content: 'Hubo un error: ' + error.message })
    })
}
w.getFetch = getFetch
 
function obtenerDatos(tabla) {
    let data = new FormData()
    data.append('tabla', tabla)

    return res = fetch('core/ajax/obtenerDatos.php', {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
}
w.obtenerDatos = obtenerDatos
 
function obtenerDatosDonde(tabla, campo, valor) {
    let data = new FormData()
    data.append('tabla', tabla)
    data.append('campo', campo)
    data.append('valor', valor)

    return res = fetch('core/ajax/verRegistro.php', {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
}
w.obtenerDatosDonde = obtenerDatosDonde

function obtenerDatosOrden(tabla, campo, valor = 'ASC') {
    let data = new FormData()
    data.append('tabla', tabla)
    data.append('campo', campo)
    data.append('valor', valor)
    data.append('orden', true)

    return res = fetch('core/ajax/verRegistro.php', {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
}
w.obtenerDatosOrden = obtenerDatosOrden

function obtenerDatosJoinJoin(tabla, tabla2, on, tabla3 = '', on2 = '') {
    let data = new FormData()
    data.append('tabla', tabla)
    data.append('tabla2', tabla2)
    data.append('on', on)
    data.append('tabla3', tabla3)
    data.append('on2', on2)

    return res = fetch('core/ajax/obtenerDatos.php', {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
}
w.obtenerDatosJoinJoin = obtenerDatosJoinJoin
 
 /** SOLICITA UN SERVICIO DEL SERVIDOR */
async function ajaxRequest(url, formData) {
    return fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
}
w.ajaxRequest = ajaxRequest