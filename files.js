const express = require('express');
const multer = require('multer');
const File = require('../models/File');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Middleware de autenticação
function auth(req, res, next) {
  if (!req.session.userId) return res.status(401).send('Não autorizado');
  next();
}

// Upload
router.post('/upload', auth, upload.single('arquivo'), async (req, res) => {
  const file = new File({
    nome: req.file.originalname,
    path: req.file.path,
    mimetype: req.file.mimetype,
    uploadedBy: req.session.userId
  });
  await file.save();
  res.send('Arquivo salvo!');
});

// Listar
router.get('/files', auth, async (req, res) => {
  const files = await File.find({ uploadedBy: req.session.userId });
  res.json(files);
});

// Download
router.get('/download/:id', auth, async (req, res) => {
  const file = await File.findById(req.params.id);
  res.download(file.path, file.nome);
});

module.exports = router;

// Middleware para tratamento de erros
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});
// Middleware para logs
const morgan = require('morgan');
router.use(morgan('dev'));
// Middleware para servir arquivos estáticos
router.use('/uploads', express.static('uploads'));
// Middleware para parsear JSON
router.use(express.json());
// Middleware para parsear URL-encoded
router.use(express.urlencoded({ extended: true }));
// Middleware para verificar se o usuário está autenticado
router.use((req, res, next) => {
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
// Exportando o router
module.exports = router;
// Exportando o app para testes
module.exports = router;
// Configuração do CORS
const cors = require('cors');
router.use(cors({
  origin: 'http://localhost:3000', // Altere para o domínio do seu frontend
  credentials: true // Permite cookies de sessão
}));
// Middleware para autenticação
function auth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).send('Não autorizado');
  }
  next();
}
// Middleware para verificar se o usuário está autenticado
router.use((req, res, next) => {
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