"use strict"

/**
 * Obtiene los lugares disponibles de la base de datos
 */
async function loadSelectLugares() {
   return fetch('lugares/get-all')
   .then(response => response.json())
   .then(dataJson => {
      let lugarHTML = `<option value="${dataJson[0].id_lugar}">- Elegir -</option>`

      for (let i in dataJson) {
         let val = dataJson[i]
         lugarHTML += `<option value="${val.id_lugar}">${val.lugar}</option>`
      }
      select_lugar.innerHTML = lugarHTML
   })
}

/**
 * Obtiene los tipos de eventos disponibles en la base de datos
 */
async function loadSelectTiposEvento() {
   fetch('tipo-eventos/get-all')
   .then(response => response.json())
   .then(dataJson => {
      let eventoHTML = `<option value="${ dataJson[0].id_tipo_evento }">- Elegir -</option>`

      for (let i in dataJson) {
         let val = dataJson[i]
         eventoHTML += `<option value="${val.id_tipo_evento}">${val.nombre_tevento}</option>`
      }
      select_evento.innerHTML = eventoHTML
      select_evento_2.innerHTML = eventoHTML
   })
}

/** PIDE INSERTAR UN EVENTO */
function insertEvent(formData, dataEvent) {
   let pax = document.querySelector('input[name="pax"]')
   
   formData.append('title', 'NUEVO EVENT ' + dataEvent.event)
   formData.append('evento', dataEvent.event)
   formData.append('nombre', c_nombre.value.toUpperCase())
   formData.append('apellido', c_apellido.value.toUpperCase())
   formData.append('start', d_init.value + ' ' + t_init.value)
   formData.append('end', d_end.value + ' ' + t_end.value)
   formData.append('personas', pax.value)
   formData.append('color', '#d7c735')
   formData.append('categoria', 'Social')
   formData.append('action', 'insert_event')

   return ajaxRequest('cotizacion/add', formData)
}

/**
 * Obtiene el todal de un evento dependiendo sus características
 */
function getTotales(formData) {
   ajaxRequest('cotizacion', formData)
   .then(dataJson => {
      if (dataJson.error) {
         popup.alert({ content: dataJson.msg })
      } else {
         let totales = dataJson.data
         t_total.innerHTML = '$ ' + totales.total
      }
   })
}

/**
 * Envía el formulario de crear cotización
 */
function sendCrearCotizacion(formId) {
   let form = document.getElementById(formId)
   let userData = new FormData(form)

   if (d_init.value + ' ' + t_init.value > d_end.value + ' ' + t_end.value) {
      popup.alert({ content: 'La fecha final debe ser posterior a la fecha de inicio'})
      return
   }

   /** COMPRUEBA LA DISPONIBILIDAD EN EL BACKEND */
   peticionAjax('cotizacion/comprobar-disp', userData)
   .then(dataJson => {
      if (dataJson.error) {
         popup.alert({ content: dataJson.msg })
         return                  
      }
      /** PREGUNTA SI DESEA GUARDAR EL EVENTO */
      popup.confirm({
         content: dataJson.msg + '<br><br>¿Registrar evento?',
         default_btns: {
            ok: 'Sí', cancel: 'No'
         }
      },
      (clck) => {
         if (clck.proceed) {
            /** INSERTA EL EVENTO EN CASO DE SER CONFIRMADO */
            let dataEvento = new FormData(form)
            dataEvento.append('renta', dataJson.data)
            
            /** CARGA EL EVENTO EN LA BASE DE DATOS */
            insertEvent(dataEvento, dataJson)
            .then((response) => {
               if (response.error) {
                  throw response.msg;
               }
               /** REGARGA EL CALENDARIO */
               $('#calendar').fullCalendar('refetchEvents')
            })
            .catch(error => {
               popup.alert({content: error})
            })
         }
      })
   })
}

function sendFormCotizacionManual(e) {
   let data      = new FormData(e.target)
   let modal_cot = document.getElementById('modal_add_cot')
   data.append('evento_id', evento_id.value)

   ajaxRequest('cotizacion/add/manual', data)
   .then(dataJson => {
      if (dataJson.error)
         throw dataJson

      popup.alert({content: 'Se registró la cotización'})
      modal_cot.style.display = 'none'
      modal_info.style.display = 'none'
      body.removeAttribute('style')
      form_add_cot.reset()
   })
   .catch(err => {
      popup.alert({ content: err.msg })
   })
}

/**
 * Calendar functions
 */
function dayClickHandler(date) {
   d_init.value = date.format()
   d_end.value  = date.format()
}

function eventClickHandler(calEvent) {
   let btns_cot  = document.getElementById('botones_cotizacion')
   let body      = document.getElementById('body')
   let modal     = document.getElementById('modal_info')
   let tbody_cot = document.getElementById('tbody_cotizaciones')
   let data      = new FormData

   openLoading()
   data.append('evento_id', calEvent.id_evento)
   tbody_cot.innerHTML = ''
   btns_cot.innerHTML = ''
   printModalCotizacion(calEvent)

   /**---- OBTIENE TODAS LAS COTIZACIONES -----*/
   getFetch('cotizacion/get-by-event/' + calEvent.id_evento)
   .then(jsonResponse => {
      let data = jsonResponse.data
      console.log(data)

      if (typeof data == 'undefined' || data < 1) {
         tbody_cot.innerHTML = `
         <tr>
            <td colspan="7">
               <button class="btn primary" onclick="showModalCotizacion('modal_add_cot')">Crear Cotización</botton>
            </td>
         </tr>
         `
      } else {
         btns_cot.innerHTML = `
         <li>
            <button class="btn-tools" onclick="borrarCotizacion(${ data[0].folio })">Borrar cotización</button>
         </li>
         <li>
            <button id="btn_imprimir" class="btn-tools" onclick="imprimirOrden(${ data[0].folio })">
               <i class="fas fa-print"></i> Imprimir
            </button>
         </li>
         <li>
            <button id="send_mail" class="btn-tools" onclick="sendEmail(${ data[0].folio })">
               <i class="far fa-envelope"></i> Enviar
            </button>
         </li>
         `
         printTableCotizacion(data)
      }
      closeLoading()
   })
   .then(() => {
      body.setAttribute('style', 'overflow: hidden')
      modal.style.display = 'block'
   })
}

/** Eventos del modal cotizacion */

function showDetailCot(idCotizacion) {
   location.href = 'cotizacion/detalle/' + idCotizacion
}

function showModalCotizacion(idName) {
   let modal = document.getElementById(idName)
   modal.style.display = 'block'
}

function showModalEditarCotizacion(idCotizacion, idName, idFormName) {
   let modal = document.getElementById(idName)
   let form  = document.getElementById(idFormName)
   form.action = 'cotizacion/detalle/' + idCotizacion
   modal.style.display = 'block'
}

function sendFormEditarCotizacion(idFormName) {
   let form = document.getElementById(idFormName)
   let data = new FormData(form)
   peticionAjax(form.action, data)
   .then(jsonResponse => {
      console.log(jsonResponse);
      
   })
}

function borrarCotizacion(idCotizacion) {
   popup.confirm({
      content: '¿Está seguro de eliminar?',
      default_btns: {
         ok: 'SÍ', cancel: 'NO'
      }
   },
   click => {
      if (click.proceed) {
         alert('Eliminaste')

         peticionAjax('cotizacion/delete/' + idCotizacion)
         .then(res => {
            //
            console.log(idCotizacion)
         })
      }
   })
}

function cerrarModalCotizacion() {
   modal_add_cot.style.display = 'none'
   form_add_cot.reset()
}

function showModalCorreo() {
   modal_correo.style.display = 'block'
}