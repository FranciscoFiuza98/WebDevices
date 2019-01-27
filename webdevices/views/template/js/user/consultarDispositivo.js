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
    
    

    //Array que guarda os ids dos 3 tipos de dispositivos
    var arrayCategoria = ["sensor", "display", "atuador"];

    var categoria;

    //Se o utilizador carregar num dos botões...
    $("#botoes img").click(function() {

        //Obtem as classes da consulta, separa por espaço e guarda num array
        var classe = $("#consulta").attr("class");
        var arrayClasse = classe.split(" ");

        //Variavel que guarda o numero de vezes que a classe dnone existe na consulta
        var countDnone = 0;

        //Percorre as classes da consulta e verifica se existe a classe d-none
        for (var i = 0; i < arrayClasse.length; i++) {
            if (arrayClasse[i] == "d-none") {
                countDnone++;
            }
        };

        //Se a classe d-none nao existir, acrescenta-a
        if (countDnone == 0) {
            $("#consulta").addClass("d-none");
        }

        //Guarda o valor do id do botão carregado
        categoria = $(this).attr("id");

        //Muda a cor de fundo desse botao para azul
        $("#" + categoria).addClass("bg-info");

        //Tira a cor de fundo dos outros botões
        for (var i = 0; i < arrayCategoria.length; i++) {
            if (arrayCategoria[i] != categoria) {
                $("#" + arrayCategoria[i]).removeClass("bg-info");
            }
        };

        //Preenche a tabela com dados dos dispositivos que tenham a mesma categoria do que a selecionada.
        preencheTabela(categoria, emailUtilizador);
    });

    $("table").delegate(".consulta", "click", function() {

        //Guarda o id da linha da lupa em que o utilizador carregou    
        var id = $(this).parent().parent().parent().find("td:first").html();
        var marca = $(this).parent().parent().parent().find("td").next().html();
        var modelo = $(this).parent().parent().parent().find("td").next().next().html();

        //Apresenta o numero, marca e modelo selecionados por cima da tabela das medicoes
        $("#numero").after().find("label:first").remove();
        $("#numero").after().append("<label>" + id + "</label>");
        $("#marca").after().find("label:first").remove();
        $("#marca").after().append("<label>" + marca + "</label>");
        $("#modelo").after().find("label:first").remove();
        $("#modelo").after().append("<label>" + modelo + "</label>");


        obterMedicoes(id);

    });
    //Quando carregar numa das cruzes da tabela...
    $("table").on("click", ".remover", function() {

        //Obtem o id da linha e o email do utilizador
        var idLinha = $(this).parent().parent().parent().find("td:first").text();

        console.log(idLinha);
        
        aviso(idLinha, categoria);
        /*if (confirm("Tem a certeza que quer remover o dispositivo com o numero " + idLinha + "?")) {
            removerDispositivo(idLinha, id);
        }*/
    })


});


//////////////FUNCOES////////////////

function obterMedicoes(id) {
    $.ajax({
        type: "GET",
        url: "/getMedicoesId",
        data: { id: id },
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Guarda as linhas a inserir na tabela
                var dadosTabela = "";

                for (var i = 0; i < result.data.length; i++) {
                    //Faz split da data recebida para apresentar apenas a data.
                    var dataStamp = result.data[i].dataMedicao.split("T");
                    var data = dataStamp[0];

                    //Passa os dados recebidos para codigo html a inserir na tabela
                    dadosTabela += "<tr>" +
                        "<td>" + result.data[i].valorMedicao + "</td>" +
                        "<td>" + data + "</td>" +
                        "</tr>"

                };

                if (result.data.length == 0) {
                    swal({
                        type: 'info',
                        text: 'Não existem medições para esse dispositivo',
                        animation: false,
                        customClass: 'animated bounce'
                    })
                    $("#consulta").addClass("d-none");


                }
                else {
                    //Faz aparecer a tabela das mediçoes.
                    $("#consulta").removeClass("d-none");
                    $("#consulta").css("margin-top", "10%");

                    //Faz scroll até a tabela das mediçoes
                    $('html, body').animate({
                        scrollTop: ($('#consulta').offset().top)
                    }, 500);
                    //Apaga os dados da tabela e insere dados novos.
                    $("#medicoes td").remove();
                    $("#medicoes tbody").append(dadosTabela);


                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function removerDispositivo(idLinha, id) {
    $.ajax({
        type: "GET",
        url: "/deleteDispositivo",
        data: { idLinha: idLinha },
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Apaga os dados da tabela e preenche de novo
                $("table td").remove();
                preencheTabela(id);
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
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {
                if (result.data.length == 0) {
                    swal({
                        type: 'info',
                        text: 'Não possui dispositivos desse tipo.!'
                    })
                }

                else {
                    //Guarda codigo html para preencher a tabela
                    var linhasTabela = "";
                    var idLinhas = 0;

                    //Percorre os dados recebidos e preenche a variavel linhasTabela com os mesmos
                    for (var i = 0; i < result.data.length; i++) {
                        idLinhas++;
                        linhasTabela += "<tr id= " + idLinhas + ">" +
                            "<td id ='dispositivo" + idLinhas + "'>" + result.data[i].id_dispositivo + "</td>" +
                            "<td>" + result.data[i].marca + "</td>" +
                            "<td>" + result.data[i].modelo + "</td>" +
                            "<td>" + result.data[i].funcionalidade + "</td>" +
                            "<td><a href='#'><i class='consulta fa fa-search'></i></td>" +
                            "<td><a href='#'><i class='remover fa fa-close'></i></td></tr>";
                    }


                    //Preenche a tabela e faz-la aparecer
                    $("tbody td").remove();
                    $("#dispositivos tbody").append(linhasTabela);
                    $("#dispositivos").removeClass("d-none");
                };


            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function aviso(idLinha, id) {
    const swalWithBootstrapButtons = swal.mixin({
        confirmButtonClass: 'btn btn-success ml-4',
        cancelButtonClass: 'btn btn-danger ml-4',
        buttonsStyling: false,
    })

    swalWithBootstrapButtons({
        title: 'Tem a certeza que quer remover o dispositivo <b> ' + idLinha + '</b>?',
        text: "Não poderá voltar atrás!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            
            swalWithBootstrapButtons(
                'Dispositivo removido!',
                'O dispositivo ' + idLinha + ' foi removido com sucesso!',
                'success'
                
            )
            removerDispositivo(idLinha, id);
            window.location.reload();
        }
        else if (
            // Read more about handling dismissals
            result.dismiss === swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons(
                'Cancelado',
                'O dispositivo ' + idLinha +' não foi removido',
                'error'
            )
        }
    })
}
