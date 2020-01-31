import '../scss/app.scss'

try {
    window.$      = window.jQuery = require('jquery')
    window.moment = require('moment')
    
} catch (error) {
    console.log(error)
}