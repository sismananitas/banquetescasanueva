
const ctx = document.getElementById("semestre1").getContext('2d'),
bg_line_color = [
   'rgba(150, 99, 132, 0.6)'
],
border_line_color = [
   'rgba(255,99,132,0.8)'
];

function cargarVentaSem1() {
   let formData = new FormData();
   formData.append('tabla', 'eventos');
   formData.append('year', sellyear);

   peticionAjax('core/ajax/APIeventos.php', 'mostrar', formData)
   .then(dataJson => {
      
      //const label_array = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN"];
      const label_array = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
      let data_ventas = [];
      
      data_ventas[0] = dataJson.enero;
      data_ventas[1] = dataJson.febrero;
      data_ventas[2] = dataJson.marzo;
      data_ventas[3] = dataJson.abril;
      data_ventas[4] = dataJson.mayo;
      data_ventas[5] = dataJson.junio;
      // SEGUNDO SEMESTRE
      data_ventas[6] = dataJson.julio;
      data_ventas[7] = dataJson.agosto;
      data_ventas[8] = dataJson.septiembre;
      data_ventas[9] = dataJson.octubre;
      data_ventas[10] = dataJson.noviembre;
      data_ventas[11] = dataJson.diciembre;
      
      let data = {
         type: 'line',
         data: {
            labels: label_array,
            datasets: [{
               //label: 'ENERO - DICIEMBRE',
               label: 'ENERO - DICIEMBRE',
               data: data_ventas,
               backgroundColor: bg_line_color,
               borderWidth: 1
            }]
         },
         options: {
            title: {
               display: false,
               text: 'Ventas'
            },
            scales: {
               yAxes: [{
                  ticks: {
                     beginAtZero: true,
                     stepSize: 1
                  }
               }],
               xAxes: [{
                  gridLines: {
                     offsetGridLines: true
                  }
               }]
            },
            responsive: true
         }
      };

      new Chart(ctx, data);
   });
}