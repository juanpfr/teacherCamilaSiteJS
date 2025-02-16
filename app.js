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

// Importar bcrypt para comparar senhas
const bcrypt = require('bcrypt')

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

// Importar módulo express-session
const session = require('express-session')

// Configurar express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Altere para true se estiver usando HTTPS
}))

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

// Middleware para passar dados da sessão para as views
app.use((req, res, next) => {
  res.locals.usuario = req.session.userNome || null
  next()
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

// Rota sobre
app.get('/sobre', function(req, res){
  // SQL
  let sqlAlunos = "SELECT COUNT(id) AS totalAlunos FROM alunos"

  // Executar comandos sql
  conexao.query(sqlAlunos, function (erro, retorno) {
      res.render('sobre', { totalAlunos: retorno[0].totalAlunos })
  })
})

// Rota Login (GET)
app.get('/login', function(req, res){
  res.render('login')
})

// Rota para Login (POST)
app.post('/login', (req, res) => {
  console.log('Formulário de login enviado') // Adicione um log para verificar
  const { email, senha } = req.body

  let sql = 'SELECT * FROM alunos WHERE email = ? AND status = "ATIVO"'
  conexao.query(sql, [email], async (erro, resultado) => {
    if (erro) {
      console.error('Erro ao buscar usuário:', erro)
      return res.render('login', { mensagem: 'Erro no servidor' })
    }

    if (resultado.length === 0) {
      return res.render('login', { mensagem: 'Usuário não encontrado ou inativo' })
    }

    const usuario = resultado[0]
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if (!senhaCorreta) {
      return res.render('login', { mensagem: 'Senha incorreta' })
    }

    // Guardar ID, e-mail e nome na sessão
    req.session.userId = usuario.id
    req.session.userEmail = usuario.email
    req.session.userNome = usuario.nome

    res.redirect('/')
  })
})

// Middleware para verificar se o usuário está logado
function verificaLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login') // Redireciona para o login se não estiver logado
  }
  next() // Se estiver logado, continua para a próxima função
}

// Rota Aluno (apenas para usuários logados)
app.get('/aluno', verificaLogin, function(req, res) {
  res.render('aluno', { usuario: req.session.userEmail })
})


// Servidor
app.listen(8080)