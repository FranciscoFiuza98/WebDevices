$(document).ready(function() {

    //Preenche a tabela 
    preencheTabela();

    $("table").on("click", ".remover", function() {
        //Obtem o id da linha e o email do utilizador
        var idLinha = $(this).parent().parent().attr("id");
        var nome = $("#" + idLinha).find("td:first").text();
        var email = $("#email" + idLinha).text();

        aviso(email, nome);
    });



    //////EDITAR///////



    //Ao carregar num dos botoes editar
    $("#tblUtilizadores").on("click", ".editar", function() {

        //Obtem os dados dessa linha
        var idLinha = $(this).parent().parent().attr("id");
        var nome = $("#nome" + idLinha).text();
        var contacto = $("#contacto" + idLinha).text();
        var email = $("#email" + idLinha).text();
        var departamento = $("#departamento" + idLinha).text();
        var setor = $("#setor" + idLinha).text();

        //Preenche o dropDown dos departamentos
        preencheDepartamentos("editarDepartamento");
        preencheSetores("editarSetor", departamento)

        //Quando um departamento é escolhido, preenche o dropDown do setor
        $("#editarDepartamento").change(function() {
            var opcaoDepartamento = $(this).find(":selected").text();
            preencheSetores("editarSetor", opcaoDepartamento);
        })


        //Preenche a tabela com os dados do utilizador a editar
        var linha = "<tr>" +
            "<td id='editarTabelaNome'>" + nome + "</td>" +
            "<td id='editarTabelaContacto'>" + contacto + "</td>" +
            "<td id='editarTabelaEmail'>" + email + "</td>" +
            "<td id='editarTabelaDepartamento'>" + departamento + "</td>" +
            "<td id='editarTabelaSetor'>" + setor + "</td>" +
            "</tr>"

        //Apaga os dados da tabela e preenche com dados novos
        $("#tblEditar td").remove();
        $("#tblEditar tbody").append(linha);

        //Faz aparecer o formúlario de edição do utilizador
        $("#editarUtilizador").removeClass("d-none");

        //Faz scroll até ao formulário
        $('html, body').animate({
            scrollTop: ($('#editarUtilizador').offset().top)
        }, 500);

        $("#editarNome").focus();

    });

    //Quando os dados são submetidos..
    $("#atualizarUtilizador").submit(function(e) {
        e.preventDefault();

        //Guarda os dos dados submetidos
        var nome = $("#editarNome").val();
        var contacto = $("#editarContacto").val();
        var email = $("#editarEmail").val();
        var departamento = $("#editarDepartamento").find(":selected").text();
        var setor = $("#editarSetor").find(":selected").text();
        var tipoUtilizador = $("#tipoUtilizador").find(":selected").text();

        //Dados atuais do seotr
        var nomeAtual = $("#editarTabelaNome").html();
        var contactoAtual = $("#editarTabelaContacto").html();
        var emailAtual = $("#editarTabelaEmail").html();
        var departamentoAtual = $("#editarTabelaDepartamento").html();
        var setorAtual = $("#editarTabelaSetor").html();

        //Nome e email em maiusculas
        var nomeCaps = nome.toUpperCase();
        var nomeAtualCaps = nomeAtual.toUpperCase();
        var emailCaps = email.toUpperCase();
        var emailAtualCaps = emailAtual.toUpperCase();



        //Se todos os campos estiverem vazios, alerta o utilizador
        if (nome == "" && contacto == "" && email == "" && departamento == "Departamento" && setor == "Setor" && tipoUtilizador == "Tipo Utilizador") {
            swal({
                type: 'info',
                text: 'Insira os dados a atualizar.'
            })
        }
        //Se algum dos campos for igual aos dados atuais do setor, alerta o utilizador
        else if (nomeCaps == nomeAtualCaps || contacto == contactoAtual || emailCaps == emailAtualCaps || departamento == departamentoAtual || setor == setorAtual) {
            swal({
                type: 'info',
                text: 'Os dados inseridos são iguais aos atuais.'
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
                        text: 'O nome tem de conter pelo menos 4 caracteres.'
                    })
                    $("#editarNome").val("");
                    $("#editarNome").focus();
                    erros++;
                }
                //Se existirem algarismos no nome, alerta o utilizador.
                else if (countNan != 0) {
                    swal({
                        type: 'info',
                        text: 'O nome não pode conter números.'
                    })
                    $("#editarNome").val("");
                    $("#editarNome").focus();
                    erros++;

                }
            }


            if (contacto != "") {

                //Se o contacto não tiver 9 algarismos, alerta o utilizador
                if (contacto.length != 9) {
                    swal({
                        type: 'info',
                        text: 'O contacto tem de conter 9 algarismos.'
                    })
                    $("#editarContacto").val("");
                    $("#editarContacto").focus();
                    erros++;
                }
                else if (contacto[0] != "9" && contacto[0] != "2") {
                    swal({
                        type: 'info',
                        text: 'Por favor insira um contacto válido.'
                    })
                    $("#editarContacto").val("");
                    $("#editarContacto").focus();
                    erros++;
                }
                else if (contacto[1] != "1" && contacto[1] != "2" && contacto[1] != "3" && contacto[1] != "6") {
                    swal({
                        type: 'info',
                        text: 'Por favor insira um contacto válido.'
                    })
                    $("#editarContacto").val("");
                    $("#editarContacto").focus();
                    erros++;
                }

            }

            //Se um departamento for escolhido mas o setor nao, alerta o utilizador
            if (departamento != "Departamento" && setor == "Setor") {
                swal({
                    type: 'info',
                    text: 'Por favor indique um setor.'
                })
                erros++;
            }

            if (erros == 0) {
                //Verifica se o utilizador inserido já existe, se nao existir atualiza o utilizador atual
                verificaUtilizadorRepetido(emailAtual, nome, contacto, email, departamento, setor, tipoUtilizador);
            }
        }
    });
    
    $("#editarCancelar").click(function() {
        $("#editarUtilizador").addClass("d-none");
    })



})


////////////FUNCOES////////////

function verificaUtilizadorRepetido(emailAtual, nome, contacto, email, departamento, setor, tipoUtilizador) {
    $.ajax({
        type: "GET",
        url: "/getUtilizadoresDepartamentoSetor",
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                var erros = 0;

                //Percorre os setores existentes e verifica se os dados inseridos são repetidos
                for (var i = 0; i < result.data.length; i++) {

                    if (emailAtual != result.data[i].email) {

                        if (contacto == result.data[i].contacto) {
                            erros++;
                            swal({
                                type: 'info',
                                text: 'Já existe um utilizador com o contacto inserido.'
                            })
                            $("#editarContacto").val("");
                            $("#editarContacto").focus();
                            break;
                        }
                        else if (email.toUpperCase() == result.data[i].email.toUpperCase()) {
                            erros++;
                            swal({
                                type: 'info',
                                text: 'Já existe um utilizador com o email inserido.'
                            })
                            $("#editarContacto").val("");
                            $("#editarContacto").focus();
                            break;
                        }
                    }
                }

                //Se os dados inseridos forem unicos, atualiza o utilizador atual
                if (erros == 0) {
                    var data = {
                        emailAtual: emailAtual,
                        nome: nome,
                        contacto: contacto,
                        email: email,
                        departamento: departamento,
                        setor: setor,
                        tipoUtilizador: tipoUtilizador
                    };

                    atualizarUtilizador(data);
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function atualizarUtilizador(data) {
    $.ajax({
        type: "POST",
        url: "/updateUtilizador",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Alerta o utilizador que o setor foi atualizado
                swal({
                    type: 'success',
                    title: 'Sucesso',
                    text: 'Utilizador atualizado com sucesso.'
                })

                //Limpa 
                $("#atualizarUtilizador")[0].reset();

                //Esconde o formulario de edição e atualiza a tabela 
                $("#editarUtilizador").addClass("d-none");
                $("#tblUtilizadores td").remove();
                $('html, body').animate({
                    scrollTop: ($('nav').offset().top)
                }, 500);
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


function preencheSetores(idDropDown, departamento) {
    $.ajax({
        type: "GET",
        url: "/getSetoresDepartamento",
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Guarda dados em codigo html dos departamentos
                var dadosSetores = "";

                //Adiciona os dados recebidos
                for (var i = 0; i < result.data.length; i++) {
                    if (departamento == result.data[i].departamento) {
                        dadosSetores += "<option>" + result.data[i].desc_setor + "</option>";
                    }

                }

                if (dadosSetores == "") {
                    swal({
                        type: 'info',
                        text: 'Não existem setores registados para o departamento escolhido.'
                    })
                }
                else {
                    $("#" + idDropDown + " option").remove();
                    $("#" + idDropDown).append("<option>Setor</option>");
                    $("#" + idDropDown).append(dadosSetores);
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}


function removerUtilizador(email) {
    $.ajax({
        type: "GET",
        url: "/deleteUtilizador",
        data: { email: email },
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Apaga os dados da tabela e preenche de novo
                $("table td").remove();
                preencheTabela();
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
        url: "/getUtilizadoresDepartamentoSetor",
        contentType: "application/json",
        success: function(result) {
            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {
                //Guarda os dados da tabela
                var dadosTabela = "";
                var idLinha = 0;
                var count = 0;

                //Acrescenta os dados recebidos aos dados da tabela.
                for (var i = 0; i < result.data.length; i++) {

                    if (result.data[i].departamento != null && result.data[i].setor != null) {
                        idLinha++;

                        dadosTabela += "<tr id='" + idLinha + "'>" +
                            "<td id='nome" + idLinha + "'>" + result.data[i].nome + "</td>" +
                            "<td id='contacto" + idLinha + "'>" + result.data[i].contacto + "</td>" +
                            "<td id='email" + idLinha + "'>" + result.data[i].email + "</td>" +
                            "<td id='departamento" + idLinha + "'>" + result.data[i].departamento + "</td>" +
                            "<td id='setor" + idLinha + "'>" + result.data[i].setor + "</td>" +
                            "<td><a href='#' class='editar'><i class='fa fa-edit'></i></td>" +
                            "<td><a href='#' class='remover'><i class='fa fa-close'></i></td></tr>";

                    }
                    else {
                        count++;
                    }

                };
                if (count == result.data.length) {
                    console.log(count)
                    swal({
                        type: 'error',
                        title: 'Erro!',
                        text: 'Nenhum Utilizador para mostar.',
                        footer: 'Poderá ser por não existir nenhum utilizador que pertença a um departamento e setor'
                    }).then(function() {
                        window.location.replace("/adminPendentes")
                    })
                }
                else {
                    //Preenche os dados da tabela
                    $("table").removeClass("d-none");
                    $("table tbody").append(dadosTabela);
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function aviso(email, nome) {
    const swalWithBootstrapButtons = swal.mixin({
        confirmButtonClass: 'btn btn-success ml-4',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
    })

    swalWithBootstrapButtons({
        title: 'Tem a certeza que quer remover o utilizador ' + nome + '?',
        text: "Não poderá voltar atrás!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {

            swalWithBootstrapButtons(
                'Utilizador Removido!',
                'O utilizador ' + nome + ' foi removido com sucesso!',
                'success'

            )
            removerUtilizador(email, nome);
        }
        else if (
            // Read more about handling dismissals
            result.dismiss === swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons(
                'Cancelado',
                'O utilizador ' + nome + ' não foi removido',
                'error'
            )
        }
    })
}
