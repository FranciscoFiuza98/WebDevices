global.app.get("/getPendentes", function(req, res) {
    var query = "SELECT * from utilizador";
    //Conecção à base de dados
    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            //Array que guarda os dados recebidos da base de dados
            var data = [];
            var pendentes = 0;
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].id_departamento == null) {
                    pendentes++;
                }
            }
            //Insere os dados recebidos na variavel data
            data.push(pendentes)

            //Manda resposta ao pedido ajax com o status de sucesso e os dados recebidos da base de dados
            res.send({ "success": "Updated Successfully", "status": 200, "data": data });
        }
    });

});

global.app.get("/getDepartamentos", function(req, res) {
    var query = "SELECT * FROM departamento order by id_departamento";


    //Conecção à base de dados
    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {

            res.send({ "success": "Updated Successfully", "status": 200, "data": rows });
        }
        else {
            console.log(err);
        }
    });

});

global.app.get("/getSetores", function(req, res) {

    var query = "SELECT * FROM setor"

    //Conecção à base de dados
    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200, "data": rows });
        }
        else {
            console.log(err);
        }
    });

});

global.app.get("/getSetoresDepartamento", function(req, res) {

    var queryDepartamento = "(SELECT desc_departamento FROM departamento WHERE setor.id_departamento = departamento.id_departamento) as departamento";
    var query = "SELECT id_setor, desc_setor, sigla," + queryDepartamento + " FROM setor";

    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {

            res.send({ "success": "Updated Successfully", "status": 200, "data": rows });

        }
        else {
            console.log(err);
        }
    });
});




global.app.get('/getUtilizadores', function(req, res) {
    var query = "SELECT * FROM utilizador order by id_utilizador"

    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200, "data": rows });
        }
        else
            console.log('Error na query Query.', err);
    });
});

global.app.get('/getUtilizadoresDepartamentoSetor', function(req, res) {

    var queryDepartamento = "(SELECT desc_departamento FROM departamento WHERE utilizador.id_departamento = departamento.id_departamento) AS departamento";
    var querySetor = "(SELECT desc_setor FROM setor WHERE utilizador.id_setor = setor.id_setor) AS setor";
    var query = "SELECT id_utilizador, email, nome, contacto, `password`," + queryDepartamento + "," + querySetor + " FROM utilizador";

    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {

            res.send({ "success": "Updated Successfully", "status": 200, "data": rows });
        }
        else
            console.log('Error na query Query.', err);
    });
});




global.app.post("/saveUtilizador", function(req, res) {


    var post = { nome: req.body.nome, email: req.body.email, contacto: req.body.contacto, password: req.body.password };

    var query = global.connect.con.query("INSERT INTO utilizador SET ?", post, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log("Erro na Query: ", err);
        }
    });
});

global.app.post("/saveDepartamento", function(req, res) {

    var query = "INSERT INTO departamento(desc_departamento, sigla) VALUES ('" + req.body.nome + "','" + req.body.sigla + "')";

    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log("Erro na Query: ", err);
        }
    });
});

global.app.post("/saveSetor", function(req, res) {

    var queryDepartamento = "(SELECT id_departamento FROM departamento WHERE desc_departamento = '" + req.body.departamento + "')";
    var query = "INSERT INTO setor(desc_setor, sigla, id_departamento) VALUES ('" + req.body.nome + "','" + req.body.sigla.toUpperCase() + "'," + queryDepartamento + ")";

    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log("Erro na Query: ", err);
        }
    });
});

global.app.get("/updateDepartamentoSetor", function(req, res) {

    var queryData = global.url.parse(req.url, true).query;

    var queryDepartamento = "(SELECT id_departamento FROM departamento WHERE desc_departamento = '" + queryData.departamento + "')";
    var querySetor = "(SELECT id_setor FROM setor WHERE desc_setor = '" + queryData.setor + "')";
    var queryUtilizador = "(SELECT id_utilizador FROM (SELECT * FROM utilizador) AS utilizador WHERE email ='" + queryData.email + "')";
    var query = "UPDATE utilizador SET id_departamento =" + queryDepartamento + ", id_setor =" + querySetor + "WHERE id_utilizador =" + queryUtilizador;

    // console.log(query);

    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log("Erro na Query: ", err);
        }
    });
});



global.app.post("/updateSetor", function(req, res) {

    //Variavel que guarda a parte SET da query de atualizacao
    var querySet = "";

    /*Para cada campo passado pelo pedido ajax, verifica se estao ou nao vazios. Se um campo nao estiver vazio, verifica se o "querySet" tem conteudo. Se ainda nao tiver nenhum
    conteudo, acrescenta os dados à query com "SET". Se já houver conteudo, acrescenta os dados à query com uma virgula.
    */
    if (req.body.nome != "" && req.body.nome != undefined) {
        if (querySet == "") {
            querySet += "SET desc_setor = '" + req.body.nome + "'";
        }
        else {
            querySet += ", desc_setor = '" + req.body.nome + "'";
        }
    }

    if (req.body.sigla != "" && req.body.sigla != undefined) {
        if (querySet == "") {
            querySet += "SET sigla = '" + req.body.sigla + "'";
        }
        else {
            querySet += ", sigla = '" + req.body.sigla + "'";
        }
    }

    if (req.body.departamento != "Departamento" && req.body.departamento != undefined) {
        var queryDepartamento = "(SELECT id_departamento FROM departamento WHERE desc_departamento = '" + req.body.departamento + "')";

        if (querySet == "") {
            querySet += "SET id_departamento = " + queryDepartamento;
        }
        else {
            querySet += ", id_departamento = " + queryDepartamento;
        }
    }

    var query = "UPDATE setor " + querySet + " WHERE id_setor = " + req.body.id;

    console.log(query);


    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log("Erro na Query: ", err);
        }
    });
});

global.app.post("/updateUtilizador", function(req, res) {

    //Variavel que guarda a parte SET da query de atualizacao
    var querySet = "";

    /*Para cada campo passado pelo pedido ajax, verifica se estao ou nao vazios. Se um campo nao estiver vazio, verifica se o "querySet" tem conteudo. Se ainda nao tiver nenhum
    conteudo, acrescenta os dados à query com "SET". Se já houver conteudo, acrescenta os dados à query com uma virgula.
    */
    if (req.body.nome != "" && req.body.nome != undefined) {
        if (querySet == "") {
            querySet += "SET nome = '" + req.body.nome + "'";
        }
        else {
            querySet += ", nome = '" + req.body.nome + "'";
        }
    }

    if (req.body.contacto != "" && req.body.contacto != undefined) {
        if (querySet == "") {
            querySet += "SET contacto = '" + req.body.contacto + "'";
        }
        else {
            querySet += ", contacto = '" + req.body.contacto + "'";
        }
    }
    
    if (req.body.email != "" && req.body.email != undefined) {
        if (querySet == "") {
            querySet += "SET email = '" + req.body.email + "'";
        }
        else {
            querySet += ", email = '" + req.body.email + "'";
        }
    }
    
    if (req.body.password != "" && req.body.password != undefined) {
        if (querySet == "") {
            querySet += "SET password = '" + req.body.password + "'";
        }
        else {
            querySet += ", password = '" + req.body.password + "'";
        }
    }

    if (req.body.departamento != "Departamento" && req.body.departamento != undefined) {
        var queryDepartamento = "(SELECT id_departamento FROM departamento WHERE desc_departamento = '" + req.body.departamento + "')";

        if (querySet == "") {
            querySet += "SET id_departamento = " + queryDepartamento;
        }
        else {
            querySet += ", id_departamento = " + queryDepartamento;
        }
    }
    
    if (req.body.setor != "Setor" && req.body.setor != undefined) {
        var querySetor = "(SELECT id_setor FROM setor WHERE desc_setor = '" + req.body.setor + "')";

        if (querySet == "") {
            querySet += "SET id_setor = " + querySetor;
        }
        else {
            querySet += ", id_setor = " + querySetor;
        }
    }
    
    if (req.body.tipoUtilizador != "Tipo Utilizador" && req.body.tipoUtilizador != undefined) {
        
        var tipo;
        
        if (req.body.tipoUtilizador == "Normal") {
            tipo = 1;
        }
        else if (req.body.tipoUtilizador == "Administrador") {
            tipo = 2;
        }

        if (querySet == "") {
            querySet += "SET tipo_utilizador = " + tipo;
        }
        else {
            querySet += ", tipo_utilizador = " + tipo;
        }
    }

    var query = "UPDATE utilizador " + querySet + " WHERE id_utilizador = (SELECT id_utilizador FROM (SELECT * FROM utilizador) AS utilizador WHERE email = '" + req.body.emailAtual + "')";

    console.log(query);


    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log("Erro na Query: ", err);
        }
    });
});

global.app.get("/updateSetorDepartamento", function(req, res) {

    var queryData = global.url.parse(req.url, true).query;

    var queryDepartamento = "(SELECT id_departamento FROM departamento WHERE desc_departamento = '" + queryData.departamento + "')";
    
    var query = "UPDATE setor SET id_departamento = " + queryDepartamento + " WHERE id_setor = " + queryData.id;

    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log("Erro na Query: ", err);
        }
    });
});


global.app.post("/updateDepartamento", function(req, res) {

    //Variavel que guarda a parte SET da query de atualizacao
    var querySet = "";

    /*Para cada campo passado pelo pedido ajax, verifica se estao ou nao vazios. Se um campo nao estiver vazio, verifica se o "querySet" tem conteudo. Se ainda nao tiver nenhum
    conteudo, acrescenta os dados à query com "SET". Se já houver conteudo, acrescenta os dados à query com uma virgula.
    */
    if (req.body.nome != "") {
        if (querySet == "") {
            querySet += "SET desc_departamento = '" + req.body.nome + "'";
        }
        else {
            querySet += ", desc_departamento = '" + req.body.nome + "'";
        }
    }

    if (req.body.sigla != "") {
        if (querySet == "") {
            querySet += "SET sigla = '" + req.body.sigla + "'";
        }
        else {
            querySet += ", sigla = '" + req.body.sigla + "'";
        }
    }


    //Query de atualizaçao
    var query = "UPDATE departamento " + querySet + " WHERE id_departamento = " + req.body.id;


    //Execucao da query
    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log("Erro na Query: ", err);
        }
    });
})




global.app.get("/deleteUtilizador", function(req, res) {

    var queryData = global.url.parse(req.url, true).query;

    var query = "DELETE FROM utilizador WHERE id_utilizador = (SELECT id_utilizador FROM (SELECT * FROM utilizador) as utilizador WHERE email = '" + queryData.email + "')";


    global.connect.con.query(query, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log("Erro na Query: ", err);
        }
    });
});

global.app.get("/deleteDispositivo", function(req, res) {

    var queryData = global.url.parse(req.url, true).query;

    var query = "DELETE FROM dispositivo WHERE id_dispositivo = '" + queryData.idLinha + "'";


    global.connect.con.query(query, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log("Erro na Query: ", err);
        }
    });
});

global.app.get("/deleteDepartamento", function(req, res) {

    var queryData = global.url.parse(req.url, true).query;

    var query = "DELETE FROM departamento WHERE id_departamento = " + queryData.id;

    global.connect.con.query(query, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log("Erro na Query: ", err);
        }
    });
});

global.app.get("/deleteSetor", function(req, res) {

    var queryData = global.url.parse(req.url, true).query;

    var query = "DELETE FROM setor WHERE id_setor = " + queryData.id;

    global.connect.con.query(query, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log("Erro na Query: ", err);
        }
    });
});
