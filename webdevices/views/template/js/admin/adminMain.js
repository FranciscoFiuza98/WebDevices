$(document).ready(function() {

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
            if (!result.success) {
                swal({
                    type: 'info',
                    text: 'A sua sessão expirou, por favor autentique-se novamente.',
                }).then(function() {
                    window.location.replace("https://ea9-cfportela.c9users.io/login");
                });
            }
            else {
                verificaPermissao(result.data.email);
            }
        }
    })
    
    
    $("#sair").click(function() {
        localStorage.removeItem("user");
        
        window.location.replace("https://ea9-cfportela.c9users.io/");
    })

});


function verificaPermissao(email) {
    $.ajax({
        type: "GET",
        url: "/getUtilizadores",
        async: false,
        success: function(result) {

            if (result.status == 200) {
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].email == email) {
                        if (result.data[i].tipo_utilizador == 1) {
                            swal({
                                type: 'error',
                                text: 'Não tem permissão para aceder a esta página'
                            }).then(function() {
                                window.location.replace("https://ea9-cfportela.c9users.io/inicio");
                            })
                        }
                    }
                }
            }
        }
    })
}


