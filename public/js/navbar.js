// SCRIPT HEADER

btn_nav.addEventListener('click', (e) => {
   if (navbar.classList.value) {
      navbar.classList.toggle('animate-nav-out');
   }
   navbar.classList.toggle('animate-nav-in');
})

$(window).on('resize', function () {
   if ($(this).width() > 900 && navbar.classList.value !== '') {
      navbar.classList.remove('animate-nav-in');
      navbar.classList.remove('animate-nav-out');
   }
})