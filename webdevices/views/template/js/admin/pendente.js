//quando inicia a página faz
$(document).ready(function() {

    preencherNotificacoes();
    preencherTabela();
    preencherDepartamentos();

    var opcaoDepartamento;


    //Quando uma opcao de departamento é selecionada...
    $("table").on("change", ".departamento", function() {
        //Guarda a opcao selecionada
        opcaoDepartamento = $(this).find(":selected").text();

        //Guarda o id da linha em que o departamento foi selecionado
        var idLinha = $(this).parent().parent().attr("id");

        //Se a opcao não for Departamento, preenche a lista de setores dessa linha.
        if (opcaoDepartamento != "Departamento") {
            preencherSetores(opcaoDepartamento, idLinha);
        }
    });

    //Quando carrega num dos vistos da tabela...
    $("table").on("click", ".adicionar", function() {
        //Obtem o id da linha, setor escolhido e o email do utilizador
        var idLinha = $(this).parent().parent().attr("id");
        var opcaoSetor = $("#setor" + idLinha).find(":selected").text();
        var email = $("#email" + idLinha).text();

        //Se o departamento ou setor nao forem escolhidos, alerta o utilizador
        if (opcaoDepartamento == "Departamento" || opcaoSetor == "Setor") {
            swal({
                type: 'info',
                text: 'Selecione um departamento e um setor',
            })
        }
        //Atribui o departamento e setor ao utilizador
        else {
            atribuiDepartamentoSetor(email, opcaoDepartamento, opcaoSetor);
        }
    });

    //Quando carregar numa das cruzes da tabela...
    $("table").on("click", ".remover", function() {

        //Obtem o id da linha e o email do utilizador
        var idLinha = $(this).parent().parent().attr("id");
        var nome = $("#" + idLinha).find("td:first").text();
        var email = $("#email" + idLinha).text();

        aviso(email, nome);

    })
});

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
                preencherTabela();
                preencherDepartamentos();
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}



function atribuiDepartamentoSetor(email, departamento, setor) {
    $.ajax({
        type: "GET",
        url: "/updateDepartamentoSetor",
        data: {
            email: email,
            departamento: departamento,
            setor: setor
        },
        contentType: "application/json",
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {
                swal({
                    type: 'success',
                    title: 'Adicionado!',
                    text: 'Utilizador adicionado com sucesso'
                })

                //Apaga os dados da tabela e preenche de novo
                $("table td").remove();
                preencherTabela();
                preencherDepartamentos();
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}


function preencherDepartamentos() {
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

                //Ao clicar numa lista de departamentos...
                $("table").on("click", ".departamento", function() {

                    //Apaga os dados da lista e volta a preencher com dados novos
                    $(this).find("option").remove();
                    $(this).append("<option>Departamento</option>");
                    $(this).append(dadosDepartamento);
                });
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function preencherTabela() {
    $.ajax({
        type: "GET",
        url: "/getUtilizadores",
        contentType: "application/json",
        async: false,
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {

                //Guarda codigo html para preencher a tabela
                var dadosTabela = "";
                //Guarda o numero de utilizadores que nao tem departamento ou setor
                var countPendentes = 0;
                var idLinhas = 0;

                //Percorre os dados recebidos
                for (var i = 0; i < result.data.length; i++) {

                    //Se o utilizadore nao tiver departamento ou setor, incrementa a contagem e adiciona uma linha aos dados da tabela.
                    if (result.data[i].id_departamento == null) {
                        countPendentes++;
                        idLinhas++;
                        console.log(result.data[i].tipo_utilizador)
    
                        dadosTabela += "<tr id='" + idLinhas + "'>" +
                            "<td>" + result.data[i].nome + "</td>" +
                            "<td>" + result.data[i].contacto + "</td>" +
                            "<td id='email" + idLinhas + "'>" + result.data[i].email + "</td>" +
                            "<td><select id='departamento" + idLinhas + "'class='departamento'><option>Departamento</option></select></td>" +
                            "<td><select id='setor" + idLinhas + "'class='setor'><option>Setor</option></select></td>" +
                            "<td><a href='#' class='adicionar'><i class='fa fa-check'></i></td>" +
                            "<td><a href='#' class='remover'><i class='fa fa-close'></i></td></tr>";
                    }
                }

                //Se nao existir nenhum utilizador pendente, alerta o utilizador
                if (countPendentes == 0) {
                    swal({
                        type: 'info',
                        text: 'Não existem utilizadores pendentes',
                    })
                }
                //Preenche a tabela
                else {
                    $("table tbody").append(dadosTabela);
                }
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
};

function preencherNotificacoes() {
    $.ajax({
        type: 'GET',
        url: '/getPendentes',
        //os dados recebidos do model estão na variável data
        success: function(result) {
            //criação de uma tabela para demonstração dos resultados recebidos
            if (result.status == 200) {
                var txt = "";
                result.data.forEach(function(row) {
                    for (var i = 0; i < result.data.length; i++) {
                        txt += result.data[i];
                    }
                });
                //envia a tabela construida para a view e mostra o resultado (txt) no object com ID result
                $("#pendentes").html(txt);
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}


function preencherSetores(departamento, idLinha) {
    $.ajax({
        type: 'GET',
        url: '/getSetoresDepartamento',
        async: false,
        data: { departamento: departamento },
        //os dados recebidos do model estão na variável data
        success: function(result) {


            //Guarda os dados dos setores em codigo html
            var dadosSetores = "";

            //Acrescenta os dados dos setores
            for (var i = 0; i < result.data.length; i++) {
                if (departamento == result.data[i].departamento) {
                    dadosSetores += "<option>" + result.data[i].desc_setor + "</option>";
                }

            }

            if (dadosSetores == "") {
                swal({
                    type: 'info',
                    text: 'Não existem setores para o departamento escolhido',
                })
            }
            else {
                //Apaga os dados da lista de setores e volta a preencher com dados novos
                $("#setor" + idLinha + " option").remove();
                $("#setor" + idLinha).append("<option>Setor</option>");
                $("#setor" + idLinha).append(dadosSetores);
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
        confirmButtonText: 'Sim, apagar!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {

            swalWithBootstrapButtons(
                'Utilizador Removido!',
                'O utilizador ' + nome + ' foi removido com sucesso!',
                'success'

            )
            removerUtilizador(email);
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
