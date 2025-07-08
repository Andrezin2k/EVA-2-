const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
