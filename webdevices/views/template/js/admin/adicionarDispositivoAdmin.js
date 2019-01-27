$(document).ready(function() {
    /*PREENCHIMENTO DA SELECT BOX E MUDANCA DE COR DOS BOTOES*/

    //Array com os ids dos 3 botoes
    var categoria = ["sensor", "display", "atuador"];

    //Quando uma das imagens é selecionada...
    $("#botoes img").on("click", function() {


        //Guarda o id da imagem selecionada na variavel id
        var id = $(this).attr("id");

        //Muda a cor de fundo da imagem selecionada para azul.
        $("#" + id).addClass("bg-info");

        //Tira a cor de fundo das outras imagens
        for (var i = 0; i < categoria.length; i++) {
            if (categoria[i] != id) {
                $("#" + categoria[i]).removeClass("bg-info");
            }
        };

        //Pedido GET ajax que envia o id da imagem selecionada no url para a rota /getFuncionalidades
        getFuncionalidades(id);

        /*var opcaoDepartamento;

        //Quando uma opcao de departamento é selecionada...
        $("select").on("change", ".departamento", function() {
            //Guarda a opcao selecionada
            opcaoDepartamento = $(this).find(":selected").text();
            console.log(opcaoDepartamento);

            //Guarda o id da linha em que o departamento foi selecionado
            var idLinha = $(this).parent().parent().attr("id");

            //Se a opcao não for Departamento, preenche a lista de setores dessa linha.
            if (opcaoDepartamento != "Departamento") {
                preencherSetores(opcaoDepartamento, idLinha);
            }
        });*/
    });




    /*VALIDACAO DO FORMULARIO*/




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
}