// Importar & configurar dotenv
const dotenv = require('dotenv')
dotenv.config()

// Importar módulo express
const express = require('express')

// Importar módulo fileupload
const fileupload = require('express-fileupload')

// Importar módulo mysql2
const mysql = require('mysql2')

// Importar módulo(nativo) File Systems
const fs = require('fs')

// App
const app = express()

// Habilitando o upload de arquivos
app.use(fileupload())

// Adicionar bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

// Adicionar bootstrap-icons
app.use('/bootstrap-icons', express.static('./node_modules/bootstrap-icons'))

// Adicionar animate CSS
app.use('/animate.css', express.static('./node_modules/animate.css'))

// Adicionar CSS próprio
app.use('/css', express.static('./assets/css'))

// Referenciar a pasta de imagens
app.use('/img', express.static('./assets/img'))

// Importar módulo express-handlebars
const { engine } = require('express-handlebars')

// Configuração do express-handlebars
app.engine('handlebars', engine({
    helpers: {
      // Função auxiliar para verificar igualdade
      condicionalIgualdade: function (parametro1, parametro2, options) {
        return parametro1 === parametro2 ? options.fn(this) : options.inverse(this);
      }
    }
  }));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Manipulação de dados via rotas
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Configuração de conexão
const conexao = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// Teste de conexão
conexao.connect(function (erro) {
    if (erro) throw erro
    console.log('Conexão efetuada com sucesso!')
})

// Rota principal
app.get('/', function (req, res) {
    // SQL
    let sqlAlunos = "SELECT COUNT(id) AS totalAlunos FROM alunos"

    // Executar comandos sql
    conexao.query(sqlAlunos, function (erro, retorno) {
        res.render('home', { totalAlunos: retorno[0].totalAlunos })
    })
})

// Servidor
app.listen(8080)