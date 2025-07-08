const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  nome: String,
  path: String,
  mimetype: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dataUpload: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);
