console.log("perfil.js loaded!");
//quando inicia a página faz
$(document).ready(function() {

    var tokenEmail;

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

            //Se o token não existir ou não for válido, alerta o utilizador e redireciona-o para a página de login.
            if (result.success) {
                tokenEmail = result.data.email;
            }
        }
    })

    preencheDadosUtilizador(tokenEmail);



    // Formulário Registo do Utilizador
    $("#atualizarUtilizador").validator().on("submit", function(e) {
        e.preventDefault();

        //Obtem os dados do formulário
        var nome = $("#nome").val();
        var contacto = $("#contacto").val();
        var password = $("#password").val();
        var passwordRepetida = $("#confirmarPassword").val();


        // Limpa os campos do formulário
        $("#atualizarUtilizador")[0].reset();

        if (nome == "" && contacto == "" && password == "" && passwordRepetida == "") {
            swal({
                type: 'info',
                text: 'Preencha os dados a atualizar'
            });
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

                if (countNan != 0) {
                    swal({
                        type: 'info',
                        text: 'O nome não pode conter números.'
                    });

                    $("#nome").val("");
                    $("#nome").focus();
                    erros++;
                }
            }

            if (contacto != "") {

                //Se o contacto não tiver 9 algarismos, alerta o utilizador
                if (contacto.length != 9) {
                    swal({
                        type: 'info',
                        text: 'O contacto tem de conter 9 algarismos.'
                    });

                    $("#contacto").val("");
                    $("#contacto").focus();
                    erros++;
                }
                //Se o primeiro algarismo do contacto não for 9 nem 2, alerta o utilizador.
                else if (contacto[0] != "9" && contacto[0] != "2") {
                    swal({
                        type: 'info',
                        text: 'Por favor insira um contacto válido.'
                    });

                    $("#contacto").val("");
                    $("#contacto").focus();
                    erros++;
                }
                //Se o segundo algarismo do contacto não for 1, 2, 3 ou 9 alerta o utilizador.
                else if (contacto[1] != "1" && contacto[1] != "2" && contacto[1] != "3" && contacto[1] != "6") {
                    swal({
                        type: 'info',
                        text: 'Por favor insira um contacto válido.'
                    });

                    $("#contacto").val("");
                    $("#contacto").focus();
                    erros++;
                }
            }

            if (password != "") {
                var letrasMaiusculas = new RegExp('[A-Z]');
                var letrasMinusculas = new RegExp('[a-z]');
                var numeros = new RegExp('[0-9]');

                if (password.match(letrasMaiusculas) && password.match(letrasMinusculas) && password.match(numeros)) {

                }
                else {
                    swal({
                        type: 'info',
                        text: 'A palavra-passe tem de ter entre 6 a 20 caracteres e conter pelo menos uma letra maiuscula e um número.'
                    });

                    erros++;
                    $("#password").val("");
                    $("#password").focus();
                }
                if (password != passwordRepetida) {
                    swal({
                        type: 'info',
                        text: 'As palavras-passe têm de ser iguais.'
                    });

                    erros++;
                    $("#password").val("");
                    $("#confirmarPassword").val("");
                    $("#password").focus();
                }
            }



            if (erros == 0) {

                var data = {
                    emailAtual: tokenEmail,
                    nome: nome,
                    contacto: contacto,
                    password: password
                };
                if (password != "") {
                    encriptarPassword(data)
                }
                else {
                    verificaUtilizadorRepetido(data);
                }

            }
        }

    });
});



//////////FUNÇÕES/////////////

function encriptarPassword(data) {

    $.ajax({
        type: "POST",
        url: "/encriptarPassword",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(result) {
            //console.log(result);
            if (result.success) {
                verificaUtilizadorRepetido(result.data);
            }
        },
        error: function(data) { console.log(data) }
    });

}

function verificaUtilizadorRepetido(data) {
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

                    if (data.emailAtual != result.data[i].email) {

                        // if (data.nome.toUpperCase() == result.data[i].nome.toUpperCase()) {
                        //     erros++;
                        //     swal({
                        //         type: 'info',
                        //         text: 'Já existe um utilizador com o nome introduzido.'
                        //     })
                        //     $("#editarNome").val("");
                        //     $("#editarNome").focus();
                        //     break;
                        // }
                        if (data.contacto == result.data[i].contacto) {
                            erros++;
                            swal({
                                type: 'info',
                                text: 'Já existe um utilizador com o contacto inserido.'
                            })
                            $("#editarContacto").val("");
                            $("#editarContacto").focus();
                            break;
                        }
                    }
                }

                //Se os dados inseridos forem unicos, atualiza o utilizador atual
                if (erros == 0) {
                    atualizarUtilizador(data);
                }

            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}


function preencheDadosUtilizador(email) {
    $.ajax({
        type: "GET",
        url: "/getUtilizadoresDepartamentoSetor",
        contentType: "application/json",
        async: false,
        success: function(result) {

            //Verifica se o resultado foi recebido com sucesso.
            if (result.status == 200) {


                //Percorre os dados recebidos
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].email == email) {

                        console.log(result.data[i]);

                        $("#nomeCompletoAtual").append(result.data[i].nome);
                        $("#contactoAtual").append(result.data[i].contacto);
                        $("#emailAtual").append(result.data[i].email);
                        if (result.data[i].departamento == null) {
                            $("#departamentoAtual").append("Sem departamento");
                        }
                        else {
                            $("#departamentoAtual").append("" + result.data[i].departamento);
                        }

                        if (result.data[i].setor == null) {
                            $("#setorAtual").append("Sem setor");
                        }
                        else {
                            $("#setorAtual").append("" + result.data[i].setor);
                        }


                    }
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
            //console.log(result);
            if (result.status == 200) {
                swal({
                    type: 'success',
                    text: 'Dados atualizados com sucesso'
                }).then(function() {
                    window.location.reload();
                })
            }
        },
        error: function(data) { console.log(data) }
    });
}
