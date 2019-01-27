$(document).ready(function() {

    $("#formLogin").validator().on("submit", function(e) {

        e.preventDefault();

        var email = $("#email").val();
        var password = $("#password").val();

        verificaUtilizadorRegistado(email, password);
    });
});


function verificaUtilizadorRegistado(email, password) {

    $.ajax({
        type: "GET",
        url: "/getUtilizadores",
        contentType: "application/json",
        success: function(result) {
            //console.log(result);
            if (result.status == 200) {

                var countEmail = 0;

                var tipoUtilizador;

                for (var i = 0; i < result.data.length; i++) {
                    if (email.toUpperCase() == result.data[i].email.toUpperCase()) {

                        countEmail++;

                        var passwordEncriptada = result.data[i].password;

                        var data = {
                            password: password,
                            passwordEncriptada: passwordEncriptada,
                            email: email,
                            nome: result.data[i].nome,
                            tipoUtilizador: result.data[i].tipo_utilizador
                        };

                        verificarPassword(data);

                    }
                }

                if (countEmail == 0) {
                    swal({
                        type: 'error',
                        title: 'O Login falhou.',
                        text: 'Não foi encontrado nenhum utilizador com o email inserido.',
                    });

                    $("#formLogin")[0].reset();
                }

            }
        },
        error: function(data) { console.log(data) }
    });

}


function verificarPassword(data) {


    $.ajax({
        type: "POST",
        url: "/verificarPassword",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(result) {
            //console.log(result);
            if (result.success) {
                if (result.valido == true) {

                    swal({
                        type: 'success',
                        text: 'Bem vindo ' + data.nome + '!',

                    }).then(function() {

                        $.ajax({
                            type: "POST",
                            url: "/getToken",
                            data: { email: data.email },
                            success: function(result) {
                                if (result.success) {
                                    localStorage.setItem("user", JSON.stringify(result));

                                    if (data.tipoUtilizador == 1) {
                                        window.location.replace("https://ea9-cfportela.c9users.io/inicio")
                                    }
                                    else if (data.tipoUtilizador == 2) {
                                        window.location.replace("https://ea9-cfportela.c9users.io/adminPendentes")
                                    }


                                }
                            },
                            error: function(data) {
                                console.log(data);
                            }
                        })
                    });
                }
                else {
                    swal({
                        type: 'error',
                        title: 'O Login falhou.',
                        text: 'A palavra-passe introduzida não é correta.',
                    });

                    $("#formLogin")[0].reset();
                }
            }
        },
        error: function(data) { console.log(data) }
    });

}
