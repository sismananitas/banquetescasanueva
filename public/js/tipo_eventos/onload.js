addEventListener('DOMContentLoaded', () => {
    const tipoEvento = new TipoEvento();

    table_teventos.addEventListener('click', e => {
        
        e.preventDefault();
        let btnClass = e.target.className;
        let btnId = e.target.parentElement.parentElement.dataset.item;

        if (btnClass == 'btn primary') {
            modal_tevento.style.display = 'block';
        }

        if (btnClass == 'btn danger') {
            popup.confirm({
                content: '¿Está seguro/a?',
                default_btns: {
                    ok: 'SÍ', cancel: 'NO'
                }
            },
            (click) => {
                if (click.proceed) {
                    let dataTipoE = new FormData(form_tevento);
                    dataTipoE.append('id', btnId);

                    tipoEvento.delete(dataTipoE)
                    .then(dataJson => {
                        if (dataJson.error)
                            throw dataJson

                        location.reload();
                    })
                    .catch(error => {
                        popup.alert({ content: error.msg })
                    })
                }
            })
        }
    })

    form_tevento.addEventListener('submit', e => {
        e.preventDefault();
        let dataTipoE = new FormData(form_tevento);

        tipoEvento.add(dataTipoE)
        .then(dataJson => {
            if (dataJson.error)
                throw dataJson

            location.reload();                       
        })
        .catch(error => {
            popup.alert({ content: error.msg })
        })
    })

    modal_tevento.addEventListener('click', e => {
        let bg = modal_tevento.querySelector('.m-bg');
        let close = modal_tevento.querySelector('.m-close');
        
        if (e.target == bg || e.target == close) {
            modal_tevento.style.display = 'none';
        }
    })
})