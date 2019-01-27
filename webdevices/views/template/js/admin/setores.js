$(document).ready(function() {

    //Preenche a tabela com os setores registados
    preencheTabela();
    preencheDepartamentos("departamento");


    $('html, body').animate({
        scrollTop: ($('nav').offset().top)
    }, 500);



    //////////DROPDOWN DEPARTAMENTO///////

    //Quando carrega num dropdown da tabela, preenche-o com departamentos registados
    $("#tblSetores").on("click", ".departamento", function() {
        var idLinha = $(this).parent().attr("id");
        var idDropDown = $("#departamento" + idLinha).attr("id");

        preencheDepartamentos(idDropDown);
    });

    //Quando seleciona um departmaento, pede ao utilizador para confirmar a açao e atualiza o setor.
    $("#tblSetores").on("change", ".departamento", function() {
        var idLinha = $(this).parent().attr("id");
        var departamento = $(this).find(":selected").text();
        var setor = $("#nome" + idLinha).text();
        var idSetor = $("#id" + idLinha).text();

        console.log(idLinha, idSetor);

        if (departamento != "Departamento" && idSetor != "") {
            avisosetor(idSetor, departamento, setor);
        }
    });


    /////////////////PESQUISAR/////////////////


    //Ao carregar no botão de pesquisar
    $("#pesquisar").on("click", function() {
        //Obtem o valor da pesquisa
        var pesquisa = $("#inputPesquisar").val();

        //Se o campo da pesquisa estiver vazio, alerta o utilizador e recarrega os dados da tabela
        if (pesquisa == "") {
            preencheTabela();
        }
        //Efetua a pesquisa
        else {
            pesquisarSetor(pesquisa);
            $("#inputPesquisar").val("");
        }
    });


    /////////////////ADICIONAR/////////////////

    //Quando carregar no botao faz aparecer o formulário e faz scroll até ao mesmo
    $("#adicionarNovoSetor").click(function() {

        //Faz aparecer o formúlario de registo do novo setor
        $("#novoSetor").removeClass("d-none");
        $("#editarSetor").addClass("d-none")

        //Faz scroll até ao formulário
        $('html, body').animate({
            scrollTop: ($('#novoSetor').offset().top)
        }, 500);

        $("#nome").focus();
    });



    /////////////////EDITAR/////////////////



    //Ao carregar num dos botoes editar
    $("#tblSetores").on("click", ".editar", function() {

        //Obtem os dados dessa linha
        var idLinha = $(this).parent().parent().attr("id");
        var numero = $("#id" + idLinha).text();
        var nome = $("#nome" + idLinha).text();
        var sigla = $("#sigla" + idLinha).text();
        var departamento = $("#departamento" + idLinha).text();

        $("#novoSetor").addClass("d-none");

        //Preenche o dropDown dos departamentos
        preencheDepartamentos("editarDepartamento");

        //Preenche a tabela com os dados do setor a editar
        var linha = "<tr>" +
            "<td id='editarTabelaNumero'>" + numero + "</td>" +
            "<td id='editarTabelaNome'>" + nome + "</td>" +
            "<td id='editarTabelaSigla'>" + sigla + "</td>" +
            "<td id='editarTabelaDepartamento'>" + departamento + "</td>" +
            "</tr>"

        //Apaga os dados da tabela e preenche com dados novos
        $("#tblEditar td").remove();
        $("#tblEditar tbody").append(linha);

        //Faz aparecer o formúlario de edição do setor
        $("#editarSetor").removeClass("d-none");
        $("#adicionarSetor").addClass("d-none");

        //Faz scroll até ao formulário
        $('html, body').animate({
            scrollTop: ($('#editarSetor').offset().top)
        }, 500);

        $("#editarNome").focus();

    });



    //Quando os dados são submetidos..
    $("#atualizarSetor").submit(function(e) {
        e.preventDefault();

        //Guarda os valores do nome, sigla e departamento
        var nome = $("#editarNome").val();
        var sigla = $("#editarSigla").val();
        var departamento = $("#editarDepartamento").find(":selected").text();

        //Dados atuais do seotr
        var numeroAtual = $("#editarTabelaNumero").html();
        var nomeAtual = $("#editarTabelaNome").html();
        var siglaAtual = $("#editarTabelaSigla").html();
        var departamentoAtual = $("#editarTabelaDepartamento").html();

        //Nome inserido, nome atual e sigla em maiusculas
        var nomeCaps = nome.toUpperCase();
        var nomeAtualCaps = nomeAtual.toUpperCase();
        var siglaCaps = sigla.toUpperCase();



        //Se todos os campos estiverem vazios, alerta o utilizador
        if (nome == "" && sigla == "" && departamento == "Departamento") {
            swal({
                type: 'info',
                text: 'Insira os dados a atualizar.',
            })
        }
        //Se algum dos campos for igual aos dados atuais do setor, alerta o utilizador
        else if (nomeCaps === nomeAtualCaps || siglaCaps == siglaAtual || departamento == departamentoAtual) {
            swal({
                type: 'info',
                text: 'Os dados inseridos são iguais aos atuais.',
            })
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
                }
                else if (nome.length > 20) {
                    swal({
                        type: 'info',
                        text: 'O nome tem de ter menos de 20 caracteres.',
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
                        text: 'A sigla tem de ter pelo menos 1 letra.',
                    })
                }
            }

            if (erros == 0) {
                //Verifica se o setor inserido já existe, se nao existir atualiza o setor atual
                verificaSetorRepetido(numeroAtual, nome, sigla.toUpperCase(), departamento);
            }

        }

    });



    /////////////////REMOVER/////////////////

    //Ao carregar numa das cruzes da tabela
    $("#tblSetores").on("click", ".remover", function() {
        //Obtem o id, numero e sigla do setor dessa linha
        var idLinha = $(this).parent().parent().attr("id");
        var numero = $("#id" + idLinha).text();
        var sigla = $("#sigla" + idLinha).text();

        aviso(numero, sigla);
    });


    /////////////////CANCELAR/////////////////

    $("#adicionarCancelar").click(function() {
        $("#novoSetor").addClass("d-none");

        $('html, body').animate({
            scrollTop: ($('nav').offset().top)
        }, 500);
    })

    $("#editarCancelar").click(function() {
        $("#editarSetor").addClass("d-none");

        $('html, body').animate({
            scrollTop: ($('nav').offset().top)
        }, 500);
    })




    /////////////////FORMULARIO/////////////


    //Quando os dados do novo setor são submetidos
    $("#registoSetor").submit(function(e) {
        e.preventDefault();


        //Guarda os valores do nome e da sigla
        var nome = $("#nome").val();
        var sigla = $("#sigla").val();
        var departamento = $("#departamento").find(":selected").text();


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

        //Se o nome tiver menos de 4 caracteres, alerta o utilizador
        if (nome.length < 4) {
            swal({
                type: 'info',
                text: 'O nome tem de conter pelo menos 4 caracteres.',
            })
            $("#nome").val("");
            $("#nome").focus();

        }
        else if (nome.length > 20) {
            swal({
                type: 'info',
                text: 'O nome tem de ter menos de 20 caracteres',
            })
            $("#nome").val("");
            $("#nome").focus();
        }
        //Se existirem algarismos no nome, alerta o utilizador.
        else if (countNan != 0) {
            swal({
                type: 'info',
                text: 'O nome não pode conter números.',
            })
            $("#nome").val("");
            $("#nome").focus();

        }
        //Se a sigla não tiver 4 caracteres, alerta o utilizador
        else if (sigla.length != 4) {
            swal({
                type: 'info',
                text: 'A sigla tem de conter 4 letras.',
            })
            $("#sigla").val("");
            $("#sigla").focus();
        }
        //Se nenhum departamento for selecionado, alerta o utilizador
        else if (departamento == "Departamento") {
            swal({
                type: 'info',
                text: 'Selecione um departamento.',
            })
        }
        else {
            var data = { nome: nome, sigla: sigla.toUpperCase(), departamento: departamento };
            adicionarSetor(data);


        }

    });


});





////////FUNÇÕES//////////////

function associaSetor(id, departamento) {
    console.log("id: " + id, "departamento: " + departamento);

    $.ajax({
        type: "GET",
        url: "/updateSetorDepartamento",
        async: false,
        data: { id: id, departamento: departamento },
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Alerta o utilizador que o setor foi atualizado
                swal({
                    type: 'success',
                    title: 'Sucesso!',
                    text: 'O setor foi atualizado com sucesso',
                })


                $("#tblSetores td").remove();
                preencheTabela();

            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}


function verificaSetorRepetido(id, nome, sigla, departamento) {
    $.ajax({
        type: "GET",
        url: "/getSetoresDepartamento",
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {
                var erros = 0;

                //Percorre os setores existentes e verifica se os dados inseridos são repetidos
                for (var i = 0; i < result.data.length; i++) {
                    if (nome.toUpperCase() == result.data[i].desc_setor.toUpperCase()) {
                        erros++;
                        swal({
                            type: 'error',
                            text: 'Já existe um setor com o nome introduzido',
                        })
                        $("#editarNome").val("");
                        $("#editarNome").focus();

                        break;
                    }
                    else if (sigla.toUpperCase() == result.data[i].sigla) {
                        erros++;
                        swal({
                            type: 'error',
                            text: 'Já existe um setor com a sigla introduzida.',
                        })
                        $("#editarSigla").val("");
                        $("#editarSigla").focus();
                        break;
                    }
                }

                //Se os dados inseridos forem unicos, atualiza o setor atual
                if (erros == 0) {
                    var data = {
                        id: id,
                        nome: nome,
                        sigla: sigla,
                        departamento: departamento
                    };

                    atualizarSetor(data);
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function atualizarSetor(data) {
    $.ajax({
        type: "POST",
        url: "/updateSetor",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Alerta o utilizador que o setor foi atualizado
                swal({
                    type: 'success',
                    title: 'Sucesso!',
                    text: 'O setor foi atualizado com sucesso.',
                })

                //Limpa 
                $("#atualizarSetor")[0].reset();

                //Esconde o formulario de edição e atualiza a tabela 
                $("#editarSetor").addClass("d-none");
                $("#tblSetores td").remove();
                preencheTabela();

            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}



function preencheDepartamentos(idDropDown) {
    $.ajax({
        type: "GET",
        url: "/getDepartamentos",
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Guarda dados em codigo html dos departamentos
                var dadosDepartamento = "";

                //Adiciona os dados recebidos
                for (var i = 0; i < result.data.length; i++) {
                    dadosDepartamento += "<option>" + result.data[i].desc_departamento + "</option>";
                }

                $("#" + idDropDown + " option").remove();
                $("#" + idDropDown).append("<option>Departamento</option>");
                $("#" + idDropDown).append(dadosDepartamento);
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function adicionarSetor(data) {

    $.ajax({
        type: "GET",
        url: "/getSetores",
        contentType: "application/json",
        success: function(result) {
            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {
                var countRepetidos = 0;

                for (var i = 0; i < result.data.length; i++) {
                    if (data.nome.toUpperCase() == result.data[i].desc_setor.toUpperCase() || data.sigla.toUpperCase() == result.data[i].sigla) {
                        countRepetidos++;
                        break;
                    }
                }

                if (countRepetidos != 0) {
                    swal({
                        type: 'error',
                        text: 'Já existe um setor com o nome ou a sigla inseridos.',
                    })
                }
                else {

                    registarSetor(data);
                }

            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function registarSetor(data) {
    $.ajax({
        type: "POST",
        url: "/saveSetor",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Alerta o utilizador que o setor foi registado com sucesso
                swal({
                    type: 'success',
                    title: 'Sucesso!',
                    text: 'Setor registado com sucesso!.',
                })
                //Atualiza a tabela 
                $("#tblSetores td").remove();
                preencheTabela();
                
                $("#registoSetor")[0].reset();
                //Faz desaparecer o formulário
                $("#novoSetor").addClass("d-none");

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


function removerSetor(id) {
    $.ajax({
        type: "GET",
        url: "/deleteSetor",
        data: { id: id },
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Apaga os dados da tabela e preenche de novo
                $("#tblSetores td").remove();
                preencheTabela();
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function pesquisarSetor(pesquisa) {
    $.ajax({
        type: "GET",
        url: "/getSetoresDepartamento",
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {
                var dadosPesquisa = "";
                var idLinha = 0;
                pesquisa = pesquisa.toUpperCase();

                //Verifica se existem setores com os dados pesquisados e adiciona aos dados de pesquisa
                for (var i = 0; i < result.data.length; i++) {
                    if (pesquisa == result.data[i].id_setor || pesquisa == result.data[i].desc_setor.toUpperCase() || pesquisa == result.data[i].sigla) {

                        idLinha++;

                        dadosPesquisa += "<tr id='" + idLinha + "'>" +
                            "<td id='id" + idLinha + "'>" + result.data[i].id_setor + "</td>" +
                            "<td id='nome" + idLinha + "'>" + result.data[i].desc_setor + "</td>" +
                            "<td id='sigla" + idLinha + "'>" + result.data[i].sigla + "</td>" +
                            "<td id='departamento" + idLinha + "'>" + result.data[i].departamento + "</td>" +
                            "<td><a href='#' class='editar'><i class='fa fa-edit'></i></a></td>" +
                            "<td><a href='#' class='remover'><i class='fa fa-close'></i></a></td></tr>";
                    }
                }

                //Se os dados de pesquisa estiverem vazios, alerta o utilizador e recarrega os dados da tabela 
                if (dadosPesquisa == "") {
                    swal({
                        type: 'info',
                        text: 'Não existem setores com a pesquisa efetuada.',
                    })

                    $("#tblSetores td").remove();
                    preencheTabela();

                    $("#inputPesquisar").val("");
                    $("#inputPesquisar").focus();
                }
                //Apaga os dados da tabela e preenche com dados novos 
                else {

                    $("#tblSetores td").remove();
                    $("#tblSetores tbody").append(dadosPesquisa);
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
        url: "/getSetoresDepartamento",
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {



                if (result.data.length == 0) {
                    swal({
                        type: 'info',
                        text: 'Não existem setores registados.',
                    })
                }
                else {


                    //Guarda dados da tabela em codigo HTML
                    var dadosTabela = "";
                    var idLinha = 0;

                    console.log(result.data);

                    //Percorre os dados recebidos e acrescenta aos dados da tabela 
                    for (var i = 0; i < result.data.length; i++) {
                        idLinha++;

                        if (result.data[i].departamento == null) {
                            dadosTabela += "<tr id='" + idLinha + "'>" +
                                "<td id='id" + idLinha + "'>" + result.data[i].id_setor + "</td>" +
                                "<td id='nome" + idLinha + "'>" + result.data[i].desc_setor + "</td>" +
                                "<td id='sigla" + idLinha + "'>" + result.data[i].sigla + "</td>" +
                                "<td class='departamento'><select id='departamento" + idLinha + "'><option>Departamento</option></select></td>" +
                                "<td><a href='#' class='editar'><i class='fa fa-edit'></i></a></td>" +
                                "<td><a href='#' class='remover'><i class='fa fa-close'></i></a></td></tr>";
                        }

                        else {
                            dadosTabela += "<tr id='" + idLinha + "'>" +
                                "<td id='id" + idLinha + "'>" + result.data[i].id_setor + "</td>" +
                                "<td id='nome" + idLinha + "'>" + result.data[i].desc_setor + "</td>" +
                                "<td id='sigla" + idLinha + "'>" + result.data[i].sigla + "</td>" +
                                "<td id='departamento" + idLinha + "'>" + result.data[i].departamento + "</td>" +
                                "<td><a href='#' class='editar'><i class='fa fa-edit'></i></a></td>" +
                                "<td><a href='#' class='remover'><i class='fa fa-close'></i></a></td></tr>";
                        }




                    }

                    //Preenche a tabela
                    $("#tblSetores td").remove();
                    $("#tblSetores tbody").append(dadosTabela);
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
        title: 'Tem a certeza que quer remover o setor <b>' + sigla + '</b>?',
        text: "Não poderá voltar atrás!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {

            swalWithBootstrapButtons(
                'Setor Removido!',
                'O setor <b>' + sigla + '</b> foi removido com sucesso!',
                'success'

            )
            removerSetor(numero, sigla);
        }
        else if (
            // Read more about handling dismissals
            result.dismiss === swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons(
                'Cancelado',
                'O setor ' + sigla + ' não foi removido',
                'error'
            )
        }
    })
}

function avisosetor(idSetor, departamento, setor) {
    const swalWithBootstrapButtons = swal.mixin({
        confirmButtonClass: 'btn btn-success ml-4',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
    })

    swalWithBootstrapButtons({
        title: 'Tem a certeza que quer associar o setor <b> ' + setor + '</b> ao departamento <b>' + departamento + '</b>?',
        text: "Não poderá voltar atrás!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, associar!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {

            swalWithBootstrapButtons(
                'Setor associado!',
                'O setor <b>' + setor + '</b> foi associado ao departamento ' + departamento + '!',
                'success'

            )
            associaSetor(idSetor, departamento, setor);
        }
        else if (
            // Read more about handling dismissals
            result.dismiss === swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons(
                'Cancelado',
                'O setor não foi associado a nenhum departamento',
                'error'
            )
        }
    })
}
