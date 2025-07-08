const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const user = new User({ nome, email, senha });
    await user.save();
    res.status(201).send('Usuário registrado!');
  } catch (err) {
    res.status(400).send('Erro ao registrar.');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Usuário não encontrado.');

  const match = await bcrypt.compare(senha, user.senha);
  if (!match) return res.status(400).send('Senha incorreta.');

  req.session.userId = user._id;
  res.send('Login efetuado!');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('Logout feito.');
});

module.exports = router;
