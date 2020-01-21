
addEventListener('DOMContentLoaded', () => {
	obtenerLugares(idlugar);
})

function obtenerLugares(select) {
	select.innerHTML = '';

	fetch('lugares/todos', {
		method: 'get'
	}).then(response => response.json())
	.then(dataJson => {
		let rowHTML = `<option value="${dataJson[0].id_lugar}"> - Elegir - </option>`;

		if (dataJson != 'fail') {
			for (let i in dataJson) {
				let item = dataJson[i];

				rowHTML += `<option value="${item.id_lugar}"> ${item.lugar} </option>`;
			}            
		} else {
			rowHTML = `<option value="2"> No se han registrado lugares </option>`;
		}
		select.innerHTML = rowHTML;
	})
	.catch(error => {
		console.log(`Surgió un error: ${error.message}`);
	})
}