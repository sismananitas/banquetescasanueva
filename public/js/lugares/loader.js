addEventListener('DOMContentLoaded', () => {

   const modal_lugar = new Modal(m_lugares);

   window.addEventListener('click', e => {
      const btn = e.target;

      if (btn === modal_lugar.fondo || btn === modal_lugar.btn_close) {
         modal_lugar.cerrar();
         form_lugares.reset();
      }

      if (btn === add_lugar) {
         modal_lugar.abrir();

      } else if (btn.className === 'btn danger') {
         popup.confirm({ content: 'Los datos asociados a este lugar tambie se borrarán. <br><br>¿Está seguro?' },
         (clck) => {
            if (clck.proceed) {
               let dataLugar = new FormData(),
               id_lugar = btn.parentElement.parentElement.firstElementChild.textContent;

               dataLugar.append('id_lugar', id_lugar);

               peticionAjax('lugares/delete', dataLugar)
               .then(dataJson => {
                  if (dataJson.error) {
                     popup.alert({ content: dataJson.msg })
                  } else {
                     location.reload();
                  }
               })
            }
         });
      }
   })

   form_lugares.addEventListener('submit', e => {
      e.preventDefault();
      let dataLugar = new FormData(form_lugares);

      peticionAjax('lugares/insert', dataLugar)
      .then(dataJson => {
         if (dataJson.error) {
            popup.alert({ content: dataJson.msg })
         } else {
            location.reload();
         }
      })
   })

   getFetch('lugares/get-all')
   .then(dataJson => {
      let rowHTML = '';
      
      if (dataJson.length) {
         for (let i in dataJson) {
            let lugar = dataJson[i];
            
            rowHTML += `<tr>
            <td>${lugar.id_lugar}</td>
            <td>${lugar.lugar}</td>
            <td><button class="btn danger">
            <i class="fas fa-trash-alt"></i>
            </button></td>
            </tr>`;
         }
      }
      tbody_lugar.innerHTML = rowHTML;
   })
})