
/** SOLICITA UN SERVICIO DEL SERVIDOR */

async function ajaxRequest(url, formData) {

   return fetch(url, {
      method: 'POST',
      body: formData
   })
   .then(response => response.json())
}