const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessão
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Conexão DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

// Rotas
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');

app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
// Exportando o app para testes
module.exports = app;   

// Configuração do CORS
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // Altere para o domínio do seu frontend
  credentials: true // Permite cookies de sessão
}));
// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});
// Middleware para logs
const morgan = require('morgan');
app.use(morgan('dev'));
// Middleware para servir arquivos estáticos
app.use('/uploads', express.static('uploads'));
// Middleware para parsear JSON
app.use(express.json());
// Middleware para parsear URL-encoded
app.use(express.urlencoded({ extended: true }));
// Middleware para autenticação
function auth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).send('Não autorizado');
  }
  next();
}
// Middleware para verificar se o usuário está autenticado
app.use((req, res, next) => {
  if (req.session.userId) {
    req.isAuthenticated = true;
  } else {
    req.isAuthenticated = false;
  }
  next();
});
// Middleware para verificar se o usuário é admin
function isAdmin(req, res, next) {
  if (req.session.userId && req.session.isAdmin) {
    return next();
  }
  res.status(403).send('Acesso negado');
}
// Middleware para verificar se o usuário é professor
function isTeacher(req, res, next) {
  if (req.session.userId && req.session.isTeacher) {
    return next();
  }
  res.status(403).send('Acesso negado');
}
// Middleware para verificar se o usuário é aluno
function isStudent(req, res, next) {
  if (req.session.userId && req.session.isStudent) {
    return next();
  }
  res.status(403).send('Acesso negado');
}

