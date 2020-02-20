import '../scss/app.scss'

try {
    window.$      = window.jQuery = require('jquery')
    window.moment = require('moment')
    window.swal = require('sweetalert2')
    
} catch (error) {
    console.log(error)
}

window.axios = require('axios')

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

const onSuccess = (response) => {
    return response
}

const onError = (fail) => {
    closeLoading()
    // var message = 'Datos incorrectos'                
    // let status  = fail.response.status

    // if (status === 401 || status === 403) message = 'Acceso no autorizado'
    // if (status === 404) message = '404 - El recurso no existe'
    // if (status === 419) message = 'La página ha expirado, favor de recargar'

    // if (message != 'Datos incorrectos') swal.fire({ type: 'error', title: message })
    return Promise.reject(fail)
}

window.axios.interceptors.response.use(onSuccess, onError)