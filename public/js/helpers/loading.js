const load_baner = document.createElement('DIV');
load_baner.className = 'loader-container';
load_baner.id        = 'loader';
load_baner.style     = 'display: none';
load_baner.innerHTML = `<div class="loader">Loading...</div>`;
document.querySelector('body').appendChild(load_baner);
  
const openLoading = () => loader.style.display = 'flex';
const closeLoading = () => loader.style.display = 'none';