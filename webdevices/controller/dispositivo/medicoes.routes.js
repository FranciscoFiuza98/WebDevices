global.app.get("/getMedicoesId", function(req, res){
   var queryData = global.url.parse(req.url, true).query; 
   
   var query = "SELECT valorMedicao, dataMedicao, horaMedicao FROM medicoes WHERE id_dispositivo = " + queryData.id;
   
   global.connect.con.query(query, function(err, rows, fields) {
       if (!err) {
           
         res.send({ "success": "Updated Successfully", "status": 200, "data": rows });
       }
       else {
           console.log(err);
       }
   })
});global.app.get("/getMedicoesId", function(req, res){
   var queryData = global.url.parse(req.url, true).query; 
   
   var query = "SELECT valorMedicao, dataMedicao, horaMedicao FROM medicoes WHERE id_dispositivo = " + queryData.id;
   
   global.connect.con.query(query, function(err, rows, fields) {
       if (!err) {
           
         res.send({ "success": "Updated Successfully", "status": 200, "data": rows });
       }
       else {
           console.log(err);
       }
   })
});