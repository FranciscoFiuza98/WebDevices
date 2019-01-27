var bcrypt = require("bcrypt");


function encriptarPassword(req, res) {
    var password =  bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(9));
    
    req.body.password = password;
    
    res.json({success: true, message:"Password Encriptada", data: req.body});
    
}

function verificarPassword(req, res) {
    var valido = bcrypt.compareSync(req.body.password, req.body.passwordEncriptada);
    
    res.json({success: true, message:"Password Verificada", data: req.body, valido: valido});
}


function getToken(req, res) {
    
    //Obtem o email do utilizador
    var email = req.body.email;
    var payload = {email: email};
    
    //Cria o token
    var token = global.jwt.sign(payload, "segredo muito secreto", {expiresIn: "10m"});
    
    //Envia resultado com o token
    res.json({success: true, message:"Token criado", token: token});
}


function checkToken(req, res){
    
    //Obtem o token
    var token = req.body.token;
    
    //Se o token existir
    if(token != ""){
        //Verifica se o token é valido, se for, responde com mensagem de sucesso, caso contrario responde com mensagem de erro.
        global.jwt.verify(token, "segredo muito secreto", function(err, decoded){
            if(err) {
                res.json({success: false, message: "Falha na autenticação do token"});
            }else {
                res.json({success: true, message: "Token verificado com sucesso", data: decoded});
            }
        })
    //Se o token nao existir, responde com mensagem de erro.    
    }else {
        res.json({success: false, message: "Sem token"});
    }
}

module.exports = {
    getToken: getToken,
    checkToken: checkToken,
    encriptarPassword: encriptarPassword,
    verificarPassword: verificarPassword
}