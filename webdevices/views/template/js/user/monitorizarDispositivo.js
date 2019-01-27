$(document).ready(function() {

    var emailUtilizador;

    //Obtem o token guardado no local storage.
    var user = JSON.parse(localStorage.getItem("user"));
    var token = "";

    if (user != null) {
        token = user.token;
    }

    $.ajax({
        type: "POST",
        url: "/checkToken",
        async: false,
        data: { token: token },
        success: function(result) {

            //Atribui o email do token à variavel emailUtilizador.
            if (result.success) {
                emailUtilizador = result.data.email;
            }
        }
    })


    //Array com os ids dos 3 botoes
    var arrayCategoria = ["sensor", "display", "atuador"];
    var categoria;

    //Quando uma das imagens é selecionada...
    $("#botoes img").on("click", function() {


        //Guarda o id da imagem selecionada na variavel id
        categoria = $(this).attr("id");

        //Muda a cor de fundo da imagem selecionada para azul.
        $("#" + categoria).addClass("bg-info");

        //Tira a cor de fundo das outras imagens
        for (var i = 0; i < arrayCategoria.length; i++) {
            if (arrayCategoria[i] != categoria) {
                $("#" + arrayCategoria[i]).removeClass("bg-info");
            }
        }

        //Preenche e mostra a tabela
        preencheTabela(categoria, emailUtilizador);

    });

    //Quando o utilizador carrega no botao filtrar...
    $("#filtrar").click(function() {
        //Guarda as opcoes selecionadas nas variaveis respetivas
        var funcionalidade = $("#funcionalidade").find(":selected").text();
        var marca = $("#marca").find(":selected").text();
        var modelo = $("#modelo").find(":selected").text();

        if (funcionalidade == "Funcionalidade" && marca == "Marca" && modelo == "Modelo") {
            swal({
                type: 'info',
                text: 'Selecione umas das opcões para filtrar'
            })
        }
        else {
            preencheTabelaFiltrar(funcionalidade, marca, modelo, categoria, emailUtilizador);
        }

    });

    $("#pesquisar").click(function() {
        var numero = $("#inputPesquisar").val();

        if (numero == "") {
            preencheTabela(categoria, emailUtilizador);
        }
        else {
            preencheTabelaPesquisar(numero, categoria);
        }

    });


    //Quando carregar numa das rodas dentadas
    $("table").on("click", ".configurar", function() {


        //Faz aoarecer as opções do dispositivo.
        $("#monitorizar" + categoria).removeClass("d-none");

        //Se existir outras opçoes visiveis, esconde-as
        for (var i = 0; i < arrayCategoria.length; i++) {
            if (arrayCategoria[i] != categoria) {
                $("#monitorizar" + arrayCategoria[i]).addClass("d-none");
            }
        }

        //Obtem o id da linha, numero, marca e modelo do dispositivo.
        var idLinha = $(this).parent().parent().attr("id");
        var numero = $(this).parent().parent().find("td:first").text();
        var marca = $("#marca" + idLinha).text();
        var modelo = $("#modelo" + idLinha).text();

        //Mostra os dados do dispositivo por cima das opçoes
        $(".numeroDispositivo").html(numero);
        $(".marcaDispositivo").html(marca);
        $(".modeloDispositivo").html(modelo);

        //Faz scroll até às opçoes do dispositivo
        $('html, body').animate({
            scrollTop: ($('#monitorizar' + categoria).offset().top)
        }, 500);
    })

    $(".gravar").on("click", function() {

        swal({
            type: 'success',
            text: 'Opções guardadas com sucesso'
        }).then(function() {
            $("#monitorizar" + categoria).addClass("d-none");
            $('html, body').animate({
                scrollTop: ($('nav').offset().top)
            }, 500);
        })
    })

});





/////////////////FUNÇÕES//////////////////////////////


function preencheTabelaFiltrar(funcionalidade, marca, modelo, categoria, email) {
    $.ajax({
        type: "GET",
        url: "/getDispositivosCategoria",
        data: { categoria: categoria, email: email },
        contentType: "application/json",
        async: false,
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Arrays que guardam os dados filtrados
                var filtroFuncionalidade = [];
                var filtroMarca = [];
                var filtroModelo = [];
                var filtroCompleto = [];

                //Variave que guarda os dados da tabela em codigo html
                var dadosTabela = "";

                for (var i = 0; i < result.data.length; i++) {

                    //Preenche os arrays com os dados filtrados
                    if (result.data[i].funcionalidade == funcionalidade || funcionalidade == "Funcionalidade") {
                        filtroFuncionalidade.push(result.data[i]);
                    }

                    if (result.data[i].marca == marca || marca == "Marca") {
                        filtroMarca.push(result.data[i]);
                    }
                    if (result.data[i].modelo == modelo || modelo == "Modelo") {
                        filtroModelo.push(result.data[i]);
                    }

                };

                //Percorre cada um dos arrays com dados filtrados, verifica se existem itens repetidos nos 3 arrays e adiciona-os ao array filtroCompleto.
                for (var i = 0; i < filtroFuncionalidade.length; i++) {
                    for (var j = 0; j < filtroMarca.length; j++) {
                        for (var k = 0; k < filtroModelo.length; k++) {
                            if (filtroFuncionalidade[i].id_dispositivo == filtroMarca[j].id_dispositivo && filtroMarca[j].id_dispositivo == filtroModelo[k].id_dispositivo) {
                                filtroCompleto.push(filtroFuncionalidade[i]);
                            }
                        }
                    }
                }

                //Se nao existir nenhum item comum aos 3 filtros, alerta o utilizador
                if (filtroCompleto.length == 0) {
                    swal({
                        type: 'info',
                        text: 'Não existe nenhum item com os filtros escolhidos'
                    })
                }
                else {
                    var idLinha = 0;

                    //Preenche os dados do filtro completo em codigo html para preencher a tabela
                    for (var i = 0; i < filtroCompleto.length; i++) {

                        idLinha++;

                        dadosTabela += "<tr id='" + idLinha + "'>" +
                            "<td>" + filtroCompleto[i].id_dispositivo + "</td>" +
                            "<td id='marca" + idLinha + "'>" + filtroCompleto[i].marca + "</td>" +
                            "<td id='modelo" + idLinha + "'>" + filtroCompleto[i].modelo + "</td>" +
                            "<td id='" + idLinha + "'>" + filtroCompleto[i].funcionalidade + "</td>" +
                            "<td><a href='#'><i class='consulta fa fa-cog'></i></td>" +
                            "</tr>";
                    }

                    //Apaga os dados da tabela e preenche com dados novos.
                    $("tbody td").remove();
                    $("table tbody").append(dadosTabela);
                }


            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}




function preencheTabela(categoria, email) {
    $.ajax({
        type: "GET",
        url: "/getDispositivosCategoria",
        data: { categoria: categoria, email: email },
        contentType: "application/json",
        async: false,
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {
                if (result.data.length == 0) {
                    swal({
                        type: 'info',
                        text: 'Não possui dispositivos deste tipo!'
                    })

                    $("#tabela").addClass("d-none");
                }
                else {

                    //Variaveis que guardam o codigo HTML
                    var funcionalidades = "";
                    var marcas = "";
                    var modelos = "";
                    var dadosTabela = "";
                    var idLinha = 0;

                    //Arrays que guardam opcoes nao repetidas
                    var arrayFuncionalidades = [];
                    var arrayMarcas = [];
                    var arrayModelos = [];

                    //Preenchimento do "titulo" das select boxes
                    $("#funcionalidade option").remove();
                    $("#funcionalidade").append("<option>Funcionalidade</option>");
                    $("#marca option").remove();
                    $("#marca").append("<option>Marca</option>");
                    $("#modelo option").remove();
                    $("#modelo").append("<option>Modelo</option>");

                    for (var i = 0; i < result.data.length; i++) {
                        //Variaveis que guardam o numero de repetiçoes de uma palavra
                        var countFuncionalidades = 0;
                        var countMarcas = 0;
                        var countModelos = 0;

                        //////////////PREENCHIMENTO DOS ARRAYS ////////////////


                        //Funcionalidades
                        for (var j = 0; j < arrayFuncionalidades.length; j++) {
                            if (result.data[i].funcionalidade == arrayFuncionalidades[j]) {
                                countFuncionalidades++;
                            }
                        }

                        if (countFuncionalidades == 0) {
                            arrayFuncionalidades.push(result.data[i].funcionalidade);
                        }


                        //Marcas
                        for (var j = 0; j < arrayMarcas.length; j++) {
                            if (result.data[i].marca == arrayMarcas[j]) {
                                countMarcas++;
                            }
                        };

                        if (countMarcas == 0) {
                            arrayMarcas.push(result.data[i].marca);
                        }


                        //Modelos
                        for (var j = 0; j < arrayModelos.length; j++) {
                            if (result.data[i].modelo == arrayModelos[j]) {
                                countModelos++;
                            }
                        };

                        if (countModelos == 0) {
                            arrayModelos.push(result.data[i].modelo);
                        }

                        //Preenchimento da tabela
                        dadosTabela += "<tr id='" + idLinha + "'>" +
                            "<td>" + result.data[i].id_dispositivo + "</td>" +
                            "<td id='marca" + idLinha + "'>" + result.data[i].marca + "</td>" +
                            "<td id='modelo" + idLinha + "'>" + result.data[i].modelo + "</td>" +
                            "<td id='funcionalidade" + idLinha + "'>" + result.data[i].funcionalidade + "</td>" +
                            "<td><a href='#' class='configurar'><i class='fa fa-cog'></i></td>" +
                            "</tr>";
                    }


                    //Preenchimento das variaveis que guardam o codigo html das opcoes
                    for (var i = 0; i < arrayFuncionalidades.length; i++) {
                        funcionalidades += "<option>" + arrayFuncionalidades[i] + "</option>";
                    }

                    for (var i = 0; i < arrayMarcas.length; i++) {
                        marcas += "<option>" + arrayMarcas[i] + "</option>";
                    }

                    for (var i = 0; i < arrayModelos.length; i++) {
                        modelos += "<option>" + arrayModelos[i] + "</option>"
                    }



                    //Preenchimento das list boxes
                    $("#funcionalidade option").after(funcionalidades);
                    $("#marca option").after(marcas);
                    $("#modelo option").after(modelos);
                    $("tbody td").remove();
                    $("table tbody").append(dadosTabela);

                    //Mostra a tabela
                    $("#tabela").removeClass("d-none");
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}



function preencheTabelaPesquisar(numero, id) {
    $.ajax({
        type: "GET",
        url: "/getDispositivosId",
        data: { numero: numero, id: id },
        contentType: "application/json",
        async: false,
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {
                //Se nao existir nenhum resultado, alerta o utilizador.
                if (result.data.length == 0) {
                    swal({
                        type: 'info',
                        text: 'Não existem dispositivos com esse número.'
                    })
                }
                else {
                    //Guarda os dados para a tabela em codigo HTML.
                    var dadosTabela = "<tr>" +
                        "<td>" + result.data[0].id_dispositivo + "</td>" +
                        "<td>" + result.data[0].marca + "</td>" +
                        "<td>" + result.data[0].modelo + "</td>" +
                        "<td>" + result.data[0].funcionalidade + "</td>" +
                        "<td><a href='#'><i class='consulta fa fa-cog'></i></td>" +
                        "</tr>";

                    //Apaga os dados da tabela e preenche com dados novos.
                    $("tbody td").remove();
                    $("table tbody").append(dadosTabela);

                    $("#inputPesquisar").val("");
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}
