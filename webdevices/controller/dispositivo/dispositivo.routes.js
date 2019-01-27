global.app.get("/getDispositivos", function(req, res) {

    var query = "SELECT * FROM dispositivo";

    global.connect.con.query(query, function(err, rows, fields) {
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200, "data": rows });
        }
        else {
            console.log(err);
        }
    });
});

global.app.get("/getDispositivosCategoria", function(req, res){
   var queryData = global.url.parse(req.url, true).query;
   
   var queryIdUtilizador = "(SELECT id_utilizador FROM utilizador WHERE email = '" + queryData.email + "')";
   var queryIdCategoria = "(SELECT id_categoria FROM categoria WHERE desc_categoria = '" + queryData.categoria + "')";
   var queryFuncionalidade = "(SELECT desc_funcionalidade FROM funcionalidade WHERE funcionalidade.id_funcionalidade = dispositivo.id_funcionalidade)";
   var query = "SELECT dispositivo.id_dispositivo, dispositivo.marca, dispositivo.modelo," + queryFuncionalidade 
             + "AS funcionalidade FROM utilizador, dispositivo_utilizador, dispositivo WHERE utilizador.id_utilizador = dispositivo_utilizador.id_utilizador AND dispositivo.id_dispositivo = dispositivo_utilizador.id_dispositivo AND dispositivo.id_categoria = " 
             + queryIdCategoria + "AND utilizador.id_utilizador = " + queryIdUtilizador;
  
  
   global.connect.con.query(query, function(err, rows, fields) {
       if (!err) {
           
         res.send({ "success": "Updated Successfully", "status": 200, "data": rows });
       }
       else {
           console.log(err);
       }
   });
 
});

global.app.get("/getDispositivosId", function(req, res){
  var queryData = global.url.parse(req.url, true).query;
   
  var queryIdCategoria = "(SELECT id_categoria FROM categoria WHERE desc_categoria = '" + queryData.id + "')";
  var queryFuncionalidade = "(SELECT desc_funcionalidade FROM funcionalidade WHERE funcionalidade.id_funcionalidade = dispositivo.id_funcionalidade)";
  var query = "SELECT id_dispositivo, marca, modelo, " + queryFuncionalidade + "as funcionalidade FROM dispositivo WHERE id_categoria = " + queryIdCategoria + "AND id_dispositivo = " + queryData.numero;
  
  global.connect.con.query(query, function(err, rows, fields) {
      if (!err) {
           
         res.send({ "success": "Updated Successfully", "status": 200, "data": rows });
      }
      else {
          console.log(err);
      }
  });
 
});

global.app.post("/saveDispositivo", function(req, res) {

    //Query de inserção de dados
    var query = "INSERT INTO dispositivo(marca, modelo, id_categoria, id_funcionalidade) VALUES('" + req.body.marca + "','" + req.body.modelo + "',(SELECT id_categoria FROM categoria WHERE desc_categoria = '" + req.body.categoria + "'),(SELECT id_funcionalidade FROM funcionalidade WHERE desc_funcionalidade = '" + req.body.funcionalidade + "'))";

    ///Execução da query
    global.connect.con.query(query, function(err, rows, fields) {

        //Se nao houver nenhum erro...
        if (!err) {
            
            var query1 = "SELECT id_dispositivo FROM dispositivo WHERE marca = '" + req.body.marca + "' AND modelo = '" + req.body.modelo + "'";
            
            global.connect.con.query(query1, function(err, rows, fields) {
                
                res.send({ "success": "Updated Successfully", "status": 200, "data": rows });
            })

        }
        //Se houver um erro..
        else {
            console.log("Erro na Query: ", err);
        }
    });
});

global.app.get("/saveDispositivoUtilizador", function(req, res) {
    var queryData = global.url.parse(req.url, true).query;
    
    var queryIdUtilizador = "(SELECT id_utilizador FROM utilizador WHERE email = '" + queryData.email + "')";

    var query = "INSERT INTO dispositivo_utilizador VALUES (" + queryIdUtilizador + "," + queryData.idDispositivo + ")";
    
    console.log(query);
    
    ///Execução da query
    global.connect.con.query(query, function(err, rows, fields) {

        //Se nao houver nenhum erro...
        if (!err) {
            res.send({ "success": "Updated Successfully", "status": 200 });
        }
        //Se houver um erro..
        else {
            console.log("Erro na Query: ", err);
        }
    });
});