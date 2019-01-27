console.log("ola");
$(document).ready(function() {

    $.ajax({
        type: "GET",
        url: "/getDispositivos",
        contentType: "application/json",
        async: false,
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                var arrayMarcas = [];
                var arrayNumeroMarca = [0];

                //Verifica se ja existe um dispositivo com o nome ou modelo inserido, se existir alerta o utilizador
                for (var i = 0; i < result.data.length; i++) {

                    var marcaRepetida = 0;

                    for (var j = 0; j < arrayMarcas.length; j++) {
                        if (result.data[i].marca == arrayMarcas[j]) {
                            marcaRepetida++;
                        }
                    }

                    if (marcaRepetida == 0) {
                        arrayMarcas.push(result.data[i].marca);
                    }

                }

                for (var i = 0; i < arrayMarcas.length; i++) {
                    arrayNumeroMarca[i] = 0;
                }

                for (var i = 0; i < result.data.length; i++) {
                    var count = 0;

                    for (var j = 0; j < arrayMarcas.length; j++) {
                        if (result.data[i].marca == arrayMarcas[j]) {
                            var numero = arrayNumeroMarca[j];

                            arrayNumeroMarca[j] = numero + 1;
                        }
                    }

                }

                var arrayMarcaJuntos = [];

                for (var i = 0; i < arrayMarcas.length; i++) {
                    arrayMarcaJuntos.push([arrayMarcas[i], arrayNumeroMarca[i]]);
                }

                google.charts.load('current', { 'packages': ['corechart'] });

                // Set a callback to run when the Google Visualization API is loaded.
                google.charts.setOnLoadCallback(drawChart);

                // Callback that creates and populates a data table,
                // instantiates the pie chart, passes in the data and
                // draws it.
                function drawChart() {

                    // Create the data table.
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Topping');
                    data.addColumn('number', 'Slices');

                    var rows = [];

                    for (var i = 0; i < arrayMarcaJuntos.length; i++) {
                        rows.push(arrayMarcaJuntos[i]);
                    }

                    data.addRows(rows);

                    // data.addRows([
                    //     [result.data[1].marca, result.data[1].marca.length],
                    //     ['Onions', 1],
                    //     ['Olives', 1],
                    //     ['Zucchini', 1],
                    //     ['Pepperoni', 2]
                    // ]);

                    // Set chart options
                    var options = {
                        'title': 'Marcas mais populares',
                        'width': 400,
                        'height': 300
                    };

                    // Instantiate and draw our chart, passing in some options.
                    var chart = new google.visualization.PieChart(document.getElementById('chart_marcas'));
                    chart.draw(data, options);
                }



            }
        },
        error: function(data) {
            console.log(data);
        }
    });
    $.ajax({
        type: "GET",
        url: "/getDispositivos",
        contentType: "application/json",
        async: false,
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                var arrayCategoria = [];
                var sensor = 0;
                var atuador = 0;
                var display = 0;
                for (var i = 0; i < result.data.length; i++) {


                    if (result.data[i].id_categoria == 1) {
                        sensor++;
                    }
                    if (result.data[i].id_categoria == 2) {
                        atuador++;
                    }
                    if (result.data[i].id_categoria == 3) {
                        display++;
                    }

                }

                console.log(sensor);
                console.log(atuador);
                console.log(display);


                google.charts.load('current', { 'packages': ['corechart'] });

                // Set a callback to run when the Google Visualization API is loaded.
                google.charts.setOnLoadCallback(drawChart);

                // Callback that creates and populates a data table,
                // instantiates the pie chart, passes in the data and
                // draws it.
                function drawChart() {

                    // Create the data table.
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Topping');
                    data.addColumn('number', 'Slices');

                    var rows = [];

                    data.addRows([
                        ['Sensor', sensor],
                        ['Atuador', atuador],
                        ['Display', display]
                    ]);


                    // Set chart options
                    var options = {
                        'title': 'Categorias de Dispositivos mais populares',
                        'width': 400,
                        'height': 300
                    };

                    // Instantiate and draw our chart, passing in some options.
                    var chart = new google.visualization.PieChart(document.getElementById('chart_tipos'));
                    chart.draw(data, options);
                }



            }
        },
        error: function(data) {
            console.log(data);
        }
    });
});
