//Quando não encontra página


//////////TOKEN///////////

global.app.post("/getToken", function(req, res){
   
   global.userController.getToken(req, res);
});

global.app.post("/checkToken", function(req, res){
   global.userController.checkToken(req, res);
})




global.app.post("/encriptarPassword", function(req, res){
   global.userController.encriptarPassword(req, res);

})

global.app.post("/verificarPassword", function(req, res) {
    global.userController.verificarPassword(req, res);
})



///////////////*Rotas Principais*//////////////////

//Rota UserMain
global.app.get("/usermain", function(req, res) {
    
    res.render("../views/template/user.main.html");
});

//Rota AdminMain

global.app.get("/adminmain", function(req, res) {
    res.render("../views/template/admin.main.html");
});

//Rota inicial
global.app.get("/", function(req, res) {
    res.render("index.html");
});

//Login
global.app.get("/login", function(req, res) {
    res.render("login.html");
});

//Registo
global.app.get("/registo", function(req, res) {
    res.render("registo.html");
});



//////////////*Rotas Utilizador*///////////////

//Main

global.app.get("/inicio", function(req, res) {
   
   var html = global.fs.readFileSync("views/user/inicio.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/user/script.perfil.html");
   
   res.render("../views/template/user.main.html", {conteudo: html, scripts: script});
});


//Meu Perfil

global.app.get("/meuPerfil", function(req, res) {
   
   var html = global.fs.readFileSync("views/user/perfil.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/user/script.perfil.html");
   
   res.render("../views/template/user.main.html", {conteudo: html, scripts: script});
});

//Adicionar Dispositivo

global.app.get("/adicionarDispositivo", function(req, res) {
   
   var html = global.fs.readFileSync("views/user/adicionarDispositivo.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/user/script.adicionarDispositivo.html");
   
   res.render("../views/template/user.main.html", {conteudo: html, scripts: script});
});

//Consultar Perfil

global.app.get("/consultarDispositivo", function(req, res) {
   
   var html = global.fs.readFileSync("views/user/consultarDispositivo.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/user/script.consultarDispositivo.html");
   
   res.render("../views/template/user.main.html", {conteudo: html, scripts: script});
});
global.app.get("/consulta", function(req, res) {
   var html = global.fs.readFileSync("views/user/consulta.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/user/script.consulta.html");
   
   res.render("../views/template/user.main.html", {conteudo: html, scripts: script});
});

//Monitorizar Dispositivo

global.app.get("/monitorizarDispositivo", function(req, res) {
   
   var html = global.fs.readFileSync("views/user/monitorizarDispositivo.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/user/script.monitorizarDispositivo.html");
   
   res.render("../views/template/user.main.html", {conteudo: html, scripts: script});
});

global.app.get("/monitorizarSensor", function(req, res) {
   
   var html = global.fs.readFileSync("views/user/monitorizarSensor.html");
   
   res.render("../views/template/user.main.html", {conteudo: html});
});


//////////////*Rotas Admin*//////////////////

//Admin Utilizadores Pendentes

global.app.get("/adminPendentes", function(req, res) {
   
   var html = global.fs.readFileSync("views/admin/admin-pendente.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/admin/script.admin-pendente.html");
   
   res.render("../views/template/admin.main.html", {conteudo: html, scripts: script});
});

//Admin Lista de utilizadores

global.app.get("/adminUtilizadores", function(req, res) {
   
   var html = global.fs.readFileSync("views/admin/admin-utilizadores.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/admin/script.admin-utilizadores.html");
   
   res.render("../views/template/admin.main.html", {conteudo: html, scripts: script});
});

//Admin Editar Perfil

global.app.get("/adminEditarPerfil", function(req, res) {
   
   var html = global.fs.readFileSync("views/admin/admin-editarPerfil.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/admin/script.admin-editarPerfil.html");
   
   res.render("../views/template/admin.main.html", {conteudo: html, scripts: script});
});

//Admin Pendentes

global.app.get("/adminDepartamentos", function(req, res) {
   
   var html = global.fs.readFileSync("views/admin/admin-departamentos.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/admin/script.admin-departamentos.html");
   
   res.render("../views/template/admin.main.html", {conteudo: html, scripts: script});
});

//Admin Setores

global.app.get("/adminSetores", function(req, res) {
   
   var html = global.fs.readFileSync("views/admin/admin-setores.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/admin/script.admin-setores.html");
   
   res.render("../views/template/admin.main.html", {conteudo: html, scripts: script});
});

//Admin Adicionar Dispositivos

global.app.get("/adminAdicionarDispositivos", function(req, res) {
   
   var html = global.fs.readFileSync("views/admin/admin-adicionarDispositivo.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/admin/script.admin-adicionarDispositivo.html");
   
   res.render("../views/template/admin.main.html", {conteudo: html, scripts: script});
});

//Admin Consultar Dispositivos

global.app.get("/adminConsultarDispositivos", function(req, res) {
   
   var html = global.fs.readFileSync("views/admin/admin-consultarDispositivo.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/admin/script.admin-consultarDispositivo.html");
   
   res.render("../views/template/admin.main.html", {conteudo: html, scripts: script});
});

//Admin Monitorizar Dispositivos

global.app.get("/adminMonitorizarDispositivos", function(req, res) {
   
   var html = global.fs.readFileSync("views/admin/admin-monitorizarDispositivo.html");
   var script = global.fs.readFileSync("views/template/mustacheScripts/admin/script.admin-monitorizarDispositivo.html");
   
   res.render("../views/template/admin.main.html", {conteudo: html, scripts: script});
});
