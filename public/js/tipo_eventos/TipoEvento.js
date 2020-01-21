class TipoEvento {
    constructor() {
        this.controller = 'tipo_evento',
        this.url = 'tipo-eventos/'
    }

    async add(formData) {
        formData.append('module', this.controller);
        return ajaxRequest(this.url + 'insert', formData)
    }

    async delete(formData) {
        formData.append('module', this.controller);
        return ajaxRequest(this.url + 'delete', formData)
    }
}