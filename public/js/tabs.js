let tabs = (element) => {
    const tabs = document.querySelector(element);

    /* Escucha el click sobre las tabs */

    tabs.addEventListener('click', (e) => {
        e.preventDefault();
        let tab = tabs.querySelectorAll('.tab');

        /* Se obtiene el tab seleccionado y su apuntador */
        let tab_selected = e.target,
        getHash = '';

        if (tab_selected.hasAttribute('href')) {
            getHash = tab_selected.getAttribute('href');

            /* Se obtienen todos los contenidos de los tabs y el contenido seleccionado */
            let tab_content      = tabs.querySelectorAll('.tab_content'),
            tab_content_selected = tabs.querySelector(getHash);
            
            /* Se recorren las tabs y se cambia su atributo class */
            for ( let i in tab ) {
                tab[i].className         = 'tab';
                tab_content[i].className = 'tab_content';           
            }            
            tab_selected.className         = 'tab active';
            tab_content_selected.className = 'tab_content show';
        }
        
    })
}