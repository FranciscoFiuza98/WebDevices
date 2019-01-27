//quando inicia a página faz
$(document).ready(function() {
    //chama a função para atualizar os users
    console.log("Registo")
});

// Formulário Registo do Utilizador
$("#registoUtilizador").validator().on("submit", function(e) {
    if (e.isDefaultPrevented()) {
        swal({
            type: 'info',
            text: 'Formulário com erros'
        });

    }
    else {
        e.preventDefault();

        // Obtem os dados do formulário
        var email = $("#email").val();
        var nome = $("#nome").val();
        var contacto = $("#contacto").val();
        var password = $("#password").val();

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
        else {
            erros++;
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
        else {
            erros++;
        }

        if (password != "") {
            var letrasMaiusculas = new RegExp('[A-Z]');
            var letrasMinusculas = new RegExp('[a-z]');
            var numeros = new RegExp('[0-9]');

            if (password.match(letrasMaiusculas) && password.match(letrasMinusculas) && password.match(numeros)) {}
            else {
                swal({
                    type: 'info',
                    text: 'Palavra-passe inválida.'
                });

                erros++;
                $("#password").val("");
                $("#password").focus();
            }


        }
        else {
            erros++;
        }

        if (erros == 0) {

            console.log("envio");

            var data = {
                email: email,
                nome: nome,
                contacto: contacto,
                password: password
            };

            verificaUtilizadorRepetido(data);
        }

    }

});

function registarUtilizador(data) {

    $.ajax({
        type: "POST",
        url: "/saveUtilizador",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(result) {
            //console.log(result);
            if (result.status == 200) {
                swal({
                    type: 'success',
                    title: 'Registado!',
                    text: 'Você foi registado com sucesso!',

                }).then(function() {
                    window.location.href = "/login";
                });
            }
        },
        error: function(data) { console.log(data) }
    });

}

function verificaUtilizadorRepetido(data) {
    $.ajax({
        type: "GET",
        url: "/getUtilizadores",
        contentType: "application/json",
        async: false,
        success: function(result) {
            if (result.status == 200) {

                var countRepetidos = 0;

                //Percorre os utilizadores e verifica se existem utilizadores com o email ou contacto inseridos
                for (var i = 0; i < result.data.length; i++) {

                    if (result.data[i].email.toUpperCase() == data.email.toUpperCase()) {

                        swal({
                            type: 'error',
                            title: 'O Registo Falhou!',
                            text: 'Já existe um utilizador com esse email.',
                        });

                        $("#email").val("");

                        countRepetidos++;
                        break;


                    }
                    else if (result.data[i].contacto == data.contacto) {
                        swal({
                            type: 'error',
                            title: 'O Registo Falhou!',
                            text: 'Já existe um utilizador com esse contacto.',

                        });

                        $("#contacto").val("");
                        countRepetidos++;
                        break;

                    }
                }

                if (countRepetidos == 0) {

                    encriptarPassword(data);

                    // registarUtilizador(data);
                }
            }
        },
        error: function(data) { console.log(data) }
    });
}

function encriptarPassword(data) {

    $.ajax({
        type: "POST",
        url: "/encriptarPassword",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(result) {
            //console.log(result);
            if (result.success) {
                registarUtilizador(result.data);
            }
        },
        error: function(data) { console.log(data) }
    });

}
