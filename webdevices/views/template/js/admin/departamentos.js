$(document).ready(function() {

    //Preenche a tabela com os dados dos departamentos 
    preencheTabela();


    /////////PESQUISAR////////////

    //Ao carregar no botao de pesquisa...
    $("#pesquisar").click(function() {
        //Obtem o valor do campo de pesquisa
        var pesquisa = $("#inputPesquisar").val();

        //Se o campo estiver vazio alerta o utilizador
        if (pesquisa == "") {
            $("table").find("td").remove();
            preencheTabela();
        }
        //Efetua a pesquisa e preenche a tabela com o resultado
        else {
            pesquisar(pesquisa);
        }
    });



    /////////ADICIONAR////////////



    //Quando carregar no botao faz aparecer o formulário e faz scroll até ao mesmo
    $("#btnAdicionarDepartamento").click(function() {

        //Faz aparecer o formúlario de registo do novo departamento
        $("#novoDepartamento").removeClass("d-none");

        //Faz scroll até ao formulário
        $('html, body').animate({
            scrollTop: ($('#novoDepartamento').offset().top)
        }, 500);

        $("#nome").focus();
    });

    //Quando os dados do novo departamento são submetidos
    $("#registoDepartamento").submit(function(e) {
        //Guarda os valores do nome e da sigla
        var nome = $("#nome").val();
        var sigla = $("#sigla").val();
        //Guarda o número de algarismos no nome
        var countNan = 0;

        //Percorre o nome e verifica se existem algarismops
        for (var i = 0; i < nome.length; i++) {
            var letraInt = parseInt(nome[i]);

            if (!isNaN(letraInt)) {
                countNan++;
                break;
            }
        }

        //Se o nome tiver menos de 6 caracteres, alerta o utilizador
        if (nome.length < 4) {
            e.preventDefault();
            swal({
                type: 'info',
                text: 'O nome tem de conter pelo menos 4 caracteres.',
            })
            $("#nome").val("");
            $("#nome").focus();
        }
        else if (nome.length > 15) {
            e.preventDefault();
            swal({
                type: 'info',
                text: 'O nome tem de ter menos de 15 caracteres.',
            })
            $("#nome").val("");
            $("#nome").focus();
        }
        //Se existirem algarismos no nome, alerta o utilizador.
        else if (countNan != 0) {
            e.preventDefault();
            swal({
                type: 'info',
                text: 'O nome não pode conter números',
            })
            $("#nome").val("");
            $("#nome").focus();

        }
        //Se a sigla não tiver 4 caracteres, alerta o utilizador
        else if (sigla.length != 4) {
            e.preventDefault();
            swal({
                type: 'info',
                text: 'A sigla só pode conter 4 letras.',
            })
            $("#sigla").val("");
            $("#sigla").focus();
        }
        else {
            e.preventDefault();
            var data = { nome: nome, sigla: sigla.toUpperCase() };
            adicionarDepartamento(data);


        }
    });




    /////////EDITAR////////////


    //Ao carregar num dos botoes editar
    $("#tblDepartamento").on("click", ".editar", function() {

        //Obtem os dados dessa linha
        var idLinha = $(this).parent().parent().attr("id");
        var numero = $("#id" + idLinha).text();
        var nome = $("#nome" + idLinha).text();
        var sigla = $("#sigla" + idLinha).text();

        $("#novoDepartamento").addClass("d-none");

        //Preenche a tabela com os dados do departamento a editar
        var linha = "<tr>" +
            "<td id='editarTabelaNumero'>" + numero + "</td>" +
            "<td id='editarTabelaNome'>" + nome + "</td>" +
            "<td id='editarTabelaSigla'>" + sigla + "</td>" +
            "</tr>"

        //Apaga os dados da tabela e preenche com dados novos
        $("#tblEditar td").remove();
        $("#tblEditar tbody").append(linha);

        //Faz aparecer o formúlario de edição do departamento
        $("#editarDepartamento").removeClass("d-none");
        $("#adicionarDepartamento").addClass("d-none");

        //Faz scroll até ao formulário
        $('html, body').animate({
            scrollTop: ($('#editarDepartamento').offset().top)
        }, 500);

        $("#editarNome").focus();

    });


    //Quando os dados são submetidos..
    $("#atualizarDepartamento").submit(function(e) {
        e.preventDefault();

        //Guarda os valores do nome, sigla e departamento
        var nome = $("#editarNome").val();
        var sigla = $("#editarSigla").val();

        //Dados atuais do seotr
        var numeroAtual = $("#editarTabelaNumero").html();
        var nomeAtual = $("#editarTabelaNome").html();
        var siglaAtual = $("#editarTabelaSigla").html();

        //Nome inserido, nome atual e sigla em maiusculas
        var nomeCaps = nome.toUpperCase();
        var nomeAtualCaps = nomeAtual.toUpperCase();
        var siglaCaps = sigla.toUpperCase();



        //Se todos os campos estiverem vazios, alerta o utilizador
        if (nome == "" && sigla == "") {
            swal({
                type: 'info',
                text: 'Insira os dados a atualizar.',
            })
        }
        //Se algum dos campos for igual aos dados atuais do departamento, alerta o utilizador
        else if (nomeCaps == nomeAtualCaps || siglaCaps == siglaAtual) {
            swal({
                type: 'info',
                text: 'Os dados inseridos são iguais aos atuais.',
            })

            $("#atualizarDepartamento")[0].reset();
        }
        else {
            var erros = 0;


            if (nome != "") {

                //Guarda o número de algarismos no nome
                var countNan = 0;

                //Percorre o nome e verifica se existem algarismops
                for (var i = 0; i < nome.length; i++) {
                    var letraInt = parseInt(nome[i]);

                    if (!isNaN(letraInt)) {
                        countNan++;
                    }
                }

                //Se o nome tiver menos de 4 caracteres, alerta o utilizador
                if (nome.length < 4) {
                    swal({
                        type: 'info',
                        text: 'O nome tem de conter pelo menos 4 caracteres.',
                    })
                    $("#editarNome").val("");
                    $("#editarNome").focus();
                    erros++;
                }
                else if (nome.length > 15) {
                    swal({
                        type: 'info',
                        text: 'O nome tem de ter menos de 15 caracteres.',
                    })
                    $("#editarNome").val("");
                    $("#editarNome").focus();
                    erros++;
                }
                //Se existirem algarismos no nome, alerta o utilizador.
                else if (countNan != 0) {
                    swal({
                        type: 'info',
                        text: 'O nome não pode conter números.',
                    })
                    $("#editarNome").val("");
                    $("#editarNome").focus();
                    erros++;

                }
            }
            if (sigla != "") {

                //Se a sigla não tiver 4 caracteres, alerta o utilizador
                if (sigla.length != 4) {
                    swal({
                        type: 'info',
                        text: 'A sigla tem de conter 4 letras.',
                    })
                    $("#editarSigla").val("");
                    $("#editarSigla").focus();
                    erros++;
                }

                //Guarda o número de algarismos no nome
                var countNan = 0;

                //Percorre o nome e verifica se existem algarismops
                for (var i = 0; i < sigla.length; i++) {
                    var letraInt = parseInt(sigla[i]);

                    if (!isNaN(letraInt)) {
                        countNan++;
                    }
                }

                //Se a sigla for composta apenas por numeros, alerta o utilizador
                if (countNan > 3) {
                    swal({
                        type: 'info',
                        text: 'A sigla tem de ter pelo menos 1 letra',
                    })
                }
            }

            if (erros == 0) {
                //Verifica se o departamento inserido já existe, se nao existir atualiza o departamento atual
                verificadepartamentoRepetido(numeroAtual, nome, sigla.toUpperCase());
            }

        }

    });


    /////////REMOVER////////////


    //Ao carregar numa das cruzes da tabela
    $("table").on("click", ".remover", function() {
        //Obtem o id, numero e sigla do departamento dessa linha
        var idLinha = $(this).parent().parent().attr("id");
        var numero = $("#id" + idLinha).text();
        var sigla = $("#sigla" + idLinha).text();

        aviso(numero, sigla);
    });

});




/////////FUNCOES////////////


function verificadepartamentoRepetido(id, nome, sigla, departamento) {
    $.ajax({
        type: "GET",
        url: "/getDepartamentos",
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {
                var erros = 0;

                //Percorre os departamentos existentes e verifica se os dados inseridos são repetidos
                for (var i = 0; i < result.data.length; i++) {
                    if (nome.toUpperCase() == result.data[i].desc_departamento.toUpperCase()) {
                        erros++;
                        swal({
                            type: 'info',
                            text: 'Já existe um departamento com o nome introduzido.',
                        })
                        $("#editarNome").val("");
                        $("#editarNome").focus();

                        break;
                    }
                    else if (sigla.toUpperCase() == result.data[i].sigla) {
                        erros++;
                        swal({
                            type: 'info',
                            text: 'Já existe um departamento com a sigla inserida.',
                        })
                        $("#editarSigla").val("");
                        $("#editarSigla").focus();
                        break;
                    }
                }

                //Se os dados inseridos forem unicos, atualiza o departamento atual
                if (erros == 0) {
                    var data = {
                        id: id,
                        nome: nome,
                        sigla: sigla,
                        departamento: departamento
                    };

                    atualizarDepartamento(data);
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function atualizarDepartamento(data) {
    $.ajax({
        type: "POST",
        url: "/updateDepartamento",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Alerta o utilizador que o setor foi atualizado
                swal({
                    type: 'success',
                    title: 'Sucesso!',
                    text: 'O Departamento foi atualizado com sucesso',

                })

                //Limpa os campos do formulario
                $("#atualizarDepartamento")[0].reset();

                //Esconde o formulario de edição e atualiza a tabela 
                $("#editarDepartamento").addClass("d-none");
                $("#tblDepartamento td").remove();
                preencheTabela();

            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}


function adicionarDepartamento(data) {

    $.ajax({
        type: "get",
        url: "/getDepartamentos",
        contentType: "application/json",
        success: function(result) {
            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {
                var countRepetidos = 0;

                for (var i = 0; i < result.data.length; i++) {
                    if (data.nome.toUpperCase() == result.data[i].desc_departamento.toUpperCase() || data.sigla == result.data[i].sigla) {
                        countRepetidos++;
                        break;
                    }
                }

                if (countRepetidos != 0) {
                    swal({
                        type: 'info',
                        text: 'Já existe um departamento com o nome ou a sigla inseridos.',
                    })
                    $("#registoDepartamento")[0].reset();
                    $("#nome").focus();
                }
                else {
                    registarDepartamento(data);
                }

            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}


function registarDepartamento(data) {
    $.ajax({
        type: "POST",
        url: "/saveDepartamento",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {
                swal({
                    type: 'success',
                    title: 'Sucesso!',
                    text: 'Departamento registado com sucesso!',

                })
                $("#registoDepartamento")[0].reset();
                $("table td").remove();
                preencheTabela();
                $("#novoDepartamento").addClass("d-none");

                //Faz scroll até à tabela
                $('html, body').animate({
                    scrollTop: ($('nav').offset().top)
                }, 500);


            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function removerDepartamento(id) {
    $.ajax({
        type: "GET",
        url: "/deleteDepartamento",
        data: { id: id },
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Apaga os dados da tabela e preenche de novo
                $("table td").remove();
                $("#editarDepartamento").addClass("d-none");
                $("#novoDepartamento").addClass("d-none");
                preencheTabela();
                
                $('html, body').animate({
            scrollTop: ($("nav").offset().top)
        }, 500);
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}


function pesquisar(pesquisa) {
    $.ajax({
        type: "GET",
        url: "/getDepartamentos",
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                pesquisa = pesquisa.toUpperCase();

                //Guarda dados da tabela em codigo HTML
                var dadosPesquisa = "";
                var idLinha = 0;

                //Percorre os dados recebidos
                for (var i = 0; i < result.data.length; i++) {

                    //Se a pesquisa feita condizer com id, descrição ou sigla do departamento...
                    if (pesquisa == result.data[i].id_departamento || pesquisa == result.data[i].desc_departamento.toUpperCase() || pesquisa == result.data[i].sigla) {

                        idLinha++;

                        dadosPesquisa += "<tr id='" + idLinha + "'>" +
                            "<td id='id" + idLinha + "'>" + result.data[i].id_departamento + "</td>" +
                            "<td>" + result.data[i].desc_departamento + "</td>" +
                            "<td id='sigla" + idLinha + "'>" + result.data[i].sigla + "</td>" +
                            "<td><a href='#'><i class='fa fa-edit'></i></a></td>" +
                            "<td><a href='#' class='remover'><i class='fa fa-close'></i></a></td></tr>";
                    }
                }

                //Se a contagem dos dados for 0, alerta o utilizador
                if (dadosPesquisa == "") {
                    swal({
                        type: "info",
                        text: "Não existem departamentos com a pesquisa inserida."
                    })


                    //Apaga o campo da pesquisa e foca o mesmo
                    $("#inputPesquisar").val("");
                    $("#inputPesquisar").focus();
                }
                //Apaga os dados da tabela e preenche com dados novos
                else {
                    $("table td").remove();
                    $("table tbody").append(dadosPesquisa);

                    //Apaga o campo da pesquisa
                    $("#inputPesquisar").val("");
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}


function preencheTabela() {
    $.ajax({
        type: "GET",
        url: "/getDepartamentos",
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                if (result.data.length == 0) {
                    swal({
                        type: 'error',
                        text: 'Não existem departamentos registados.',
                    })
                }
                else {
                    //Guarda dados da tabela em codigo HTML
                    var dadosTabela = "";
                    var idLinha = 0;

                    //Percorre os dados recebidos e acrescenta aos dados da tabela 
                    for (var i = 0; i < result.data.length; i++) {
                        idLinha++;

                        dadosTabela += "<tr id='" + idLinha + "'>" +
                            "<td id='id" + idLinha + "'>" + result.data[i].id_departamento + "</td>" +
                            "<td id='nome" + idLinha + "'>" + result.data[i].desc_departamento + "</td>" +
                            "<td id='sigla" + idLinha + "'>" + result.data[i].sigla + "</td>" +
                            "<td><a href='#' class='editar'><i class='fa fa-edit'></i></a></td>" +
                            "<td><a href='#' class='remover'><i class='fa fa-close'></i></a></td></tr>";
                    }

                    //Preenche a tabela
                    $("table tbody").append(dadosTabela);
                }


            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function aviso(numero, sigla) {
    const swalWithBootstrapButtons = swal.mixin({
        confirmButtonClass: 'btn btn-success ml-4',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
    })

    swalWithBootstrapButtons({
        title: 'Tem a certeza que quer remover o Departamento ' + sigla + '?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {

            swalWithBootstrapButtons(
                'Departamento Removido!',
                'O departamento ' + sigla + ' foi removido com sucesso!',
                'success'

            )
            removerDepartamento(numero);
        }
        else if (
            // Read more about handling dismissals
            result.dismiss === swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons(
                'Cancelado',
                'O departamento ' + sigla + ' não foi removido',
                'error'
            )
        }
    })
}
