class Modal {
   constructor(modal_id) {
      this.m         = modal_id;
      this.titulo    = this.m.querySelector('.title');
      this.fondo     = this.m.querySelector('.flex');
      this.btn_close = this.m.querySelector('.close');
   }

   abrir() {
      this.m.style.display = 'block';
   }

   cerrar() {
      this.m.style.display = 'none';
   }
}