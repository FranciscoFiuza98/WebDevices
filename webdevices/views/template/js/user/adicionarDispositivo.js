$(document).ready(function() {

    /*PREENCHIMENTO DA SELECT BOX E MUDANCA DE COR DOS BOTOES*/

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
        };

        //Pedido GET ajax que envia o id da imagem selecionada no url para a rota /getFuncionalidades
        getFuncionalidades(categoria);

    });




    /*VALIDACAO DO FORMULARIO*/

    $("form").submit(function(e) {
        e.preventDefault();

        //Variavel que regista o numero de botoes que estão selecionados.
        var countCor = 0;

        //Opção selecionada
        var marca = $("#marca").val();
        var modelo = $("#modelo").val();
        var funcionalidade = $("select").find(":selected").text();

        //Para cada botao...
        $("#botoes img").each(function() {

            //Verifica a cor do fundo do botao
            var cor = $(this).css("backgroundColor");

            //Se a cor for azul...
            if (cor == "rgb(23, 162, 184)") {

                //Guarda o id do botao selecionado 
                var categoria = $(this).attr("id");

                //Atribui o id como valor do input da categoria no form(esta invisivel)
                $("#categoria").val(categoria);

                //Conta o numero de botoes selecionados
                countCor++;

            };
        });

        //Se nenhum dos botões estiver selecionado...
        if (countCor == 0) {

            //Lança um alerta a pedir ao utilizador para escolher um tipo de dispositivo
            alert("Selecione um tipo de dispositivo.");
        }

        //Se a funcionalidade escolhida for Funcionalidade
        else if (funcionalidade == "Funcionalidade") {

            //Pede ao utilizador para selecionar uma funcionalidade
            swal({
                type: 'info',
                text: 'Selecione uma funcionalidade!'
            })
        }
        else {
            /*PEDIDO AJAX PARA LER A TABELA DOS DISPOSITIVOS*/
            verificaDispositivoRepetido(marca, modelo, funcionalidade, categoria);
        }




    });
});


function getFuncionalidades(id) {
    $.ajax({
        type: "GET",
        url: "/getFuncionalidades",
        data: { id: id },
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Variavel que guarda o codigo html com os dados recebidos no result
                var select = "";

                //Percorre os dados recebidos 
                for (var i = 0; i < result.data.length; i++) {
                    //Variavel que guarda o numero de vezes que uma opção é repetida
                    var count = 0;

                    //Para cada opcao do Select funcionalidade...
                    $("#funcionalidade option").each(function() {

                        //Guarda o texto de cada opcao nesta variavel
                        var opcao = $(this).text();

                        //Verifica se a opcao é Funcionalidade ou uma das opcoes recebidas no result
                        if (opcao != "Funcionalidade" && opcao != result.data[i]) {
                            //Apaga as opcoes que estao a mais
                            $(this).remove();

                        }

                        //Se a opcao for igual a um dos dados recebidos....
                        if (opcao == result.data[i]) {
                            //Aumenta a contagem por 1
                            count++;

                            //Se o count for maior que 0...
                            if (count > 0) {
                                //Apaga a opcao repetida
                                $(this).remove();

                            }
                        }

                    });

                    //Adiciona as opcoes recebidas do pedido à variavel select como codigo html
                    select += "<option>" + result.data[i] + "</option>";
                };

                //Acrescenta as opcoes recebidas ao Select
                $("#funcionalidade").append(select);
                $("#formulario").removeClass("d-none");
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
};

function verificaDispositivoRepetido(marca, modelo, funcionalidade, categoria) {

    $.ajax({
        type: "GET",
        url: "/getDispositivos",
        contentType: "application/json",
        async: false,
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                var erros = 0;

                //Verifica se ja existe um dispositivo com o nome ou modelo inserido, se existir alerta o utilizador
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].marca.toUpperCase() == marca.toUpperCase() && result.data[i].modelo.toUpperCase() == modelo.toUpperCase()) {
                        erros++;
                        swal({
                            type: 'error',
                            title: 'Erro!',
                            text: 'Já existe um dispositivo com esta marca e modelo!'
                        })
                    }
                }

                if (erros == 0) {

                    var data = {
                        marca: marca,
                        modelo: modelo,
                        funcionalidade: funcionalidade,
                        categoria: categoria
                    };

                    registarDispositivo(data);


                }


            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function registarDispositivo(data) {

    $.ajax({
        type: "POST",
        url: "/saveDispositivo",
        data: JSON.stringify(data),
        contentType: "application/json",
        async: false,
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                var idDispositivo = result.data[0].id_dispositivo;

                obterEmailToken(idDispositivo);

            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function obterEmailToken(idDispositivo) {

    //Obtem o token guardado no local storage.
    var user = JSON.parse(localStorage.getItem("user"));
    var token = "";

    if (user != null) {
        token = user.token;
    }

    //Verifica se o token é valido
    $.ajax({
        type: "POST",
        url: "/checkToken",
        async: false,
        data: { token: token },
        success: function(result) {


            if (result.success) {

                atribuiDispositivoUtilizador(idDispositivo, result.data.email);

            }
        }
    })
}

function atribuiDispositivoUtilizador(idDispositivo, email) {
    //Verifica se o token é valido
    $.ajax({
        type: "GET",
        url: "/saveDispositivoUtilizador",
        async: false,
        data: { idDispositivo: idDispositivo, email: email },
        success: function(result) {
            if (result.status == 200) {

                swal({
                    type: 'success',
                    text: 'Dispositivo registado com sucesso!'
                }).then(function() {
                    window.location.reload();
                });
                

            }
        }
    })
}
