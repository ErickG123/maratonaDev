/* Configurando o servidor para a aplicação */
const express = require("express");
const server = express();

/* Configurando o servidor para apresentar arquivos estáticos 'CSS, Scripts' */
server.use(express.static('public'));

/* Habilitando o body do formulario */
server.use(express.urlencoded({ extended: true }));

/* Configurando a conexão com o banco de dados */
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: 'Erick123',
    host: 'localhost',
    port: 5432,
    database: 'doe',
});

/* Configurando a template engine 'nunjucks' */
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true,
});

/* Configurando a apresentação da página */
/* Pega dados */
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de banco de dados.")
        
        /* Retornando os valores das tabelas no banco de dados */
        const donors = result.rows;
        return res.render("index.html", { donors });
    });
});

/* Recebe os dados do formulario */
/* Registra dados */
server.post("/", function(req, res) {
    /* Pegar dados do formulario */
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    /* Regra de negócio */
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.");
    }

    /* Colocando valores dentro do banco de dados */
    const query = 
    `INSERT INTO donors ("name", "email", "blood") 
    VALUES($1, $2, $3)`
    
    const values = [name, email, blood]

    db.query(query, values, function(err) {
        /* Fluxo de erro */
        if (err) return res.send("Erro de banco de dados.")
    
        /* Fluxo ideal */
        return res.redirect("/");
    });
  
})

/* Ligando o servidor */
/* Permitindo o acesso na porta 3000 */
server.listen(3000, function() {
    console.log("Servidor iniciado");
});