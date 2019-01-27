var port = process.env.PORT;

global.utilizadorEmail = "";


//Carregamento de modulos
global.expressValidator = require("express-validator");
global.express = require('express');
global.fs = require('fs');
global.mysql = require('mysql');
global.bodyParser = require('body-parser');
global.mustacheExpress = require("mustache-express");
global.url = require("url");
global.jwt = require("jsonwebtoken");

//Usos da app
global.app = global.express();

//Body Parser / Express Validator
global.app.use(global.bodyParser.json(), global.bodyParser.urlencoded({ extended: true }));
global.app.use(global.bodyParser.json());
global.app.use(global.expressValidator());

//Mustache
global.app.engine('html', global.mustacheExpress());
global.app.set('view engine', 'html');
global.app.set('views', __dirname + '/views');

//Diretorios
global.html_dir = "./views/"


//definir rotas estáticas para ficheiros
global.app.use('/controller', global.express.static('controller'));
global.app.use("/img", global.express.static(__dirname + '/assets/img'));
global.app.use("/js", global.express.static(__dirname + '/views/template/js'));
global.app.use("/style", global.express.static(__dirname + '/assets/style'));
global.app.use("/user", global.express.static(__dirname + "/views/user"));
global.app.use("/admin", global.express.static(__dirname + "/views/admin"));
global.app.use("/views", global.express.static(__dirname + "/views"));
global.app.use("/scripts", global.express.static(__dirname + "/views/template/mustacheScripts"));


//carregar ficheiros MVC
global.connect = require('./assets/connect');

//Routes
global.userDatabase = require("./controller/user/user.database.routes.js");
global.userRoutes = require('./controller/user/user.main.routes.js');
global.dispositivoRoutes = require("./controller/dispositivo/dispositivo.routes.js");
global.funcionalidadeRoutes = require("./controller/dispositivo/funcionalidade.routes.js");
global.medicoesRoutes = require("./controller/dispositivo/medicoes.routes.js");
global.userController = require("./controller/user/user.controller.js");

//Iniciar aplicação
global.app.listen(port);
