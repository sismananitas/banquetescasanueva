class Modal {
   constructor(id_modal) {
      this.m     = id_modal;
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