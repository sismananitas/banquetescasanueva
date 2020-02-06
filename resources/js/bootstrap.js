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