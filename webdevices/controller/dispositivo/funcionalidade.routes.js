global.app.get("/getFuncionalidades", function(req, res) {

    //Guarda os dados passados pelo URL nesta variavel
    var queryData = global.url.parse(req.url, true).query;

    console.log(queryData.id);

    //Query que retorna todas as funcionalidades associadas à categoria que foi passada pelo url
    var query = "SELECT desc_funcionalidade FROM funcionalidade WHERE id_categoria = (SELECT id_categoria FROM categoria WHERE desc_categoria = '" + queryData.id + "')";


    //Conecção à base de dados
    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            //Array que guarda os dados recebidos da base de dados
            var data = [];

            //Insere os dados recebidos na variavel data
            for (var i = 0; i < rows.length; i++) {
                data.push(rows[i].desc_funcionalidade);
            };

            //Manda resposta ao pedido ajax com o status de sucesso e os dados recebidos da base de dados
            res.send({ "success": "Updated Successfully", "status": 200, "data": data });
        }
        else {
            console.log(err);
        }
    });

});

global.app.post("/saveFuncionalidade", function(req, res) {
    var query = "INSERT INTO funcionalidade(id_categoria, desc_funcionalidade) VALUES((SELECT id_categoria FROM categoria WHERE desc_categoria = '" + req.body.categoria + "'),'" + req.body.funcionalidade +  "')";
    
    //Conecção à base de dados
    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        else {
            console.log(err);
        }
    });
})