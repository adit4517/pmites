// File: server/models/Counter.js

const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Nama counter, e.g., 'pmiId'
    seq: { type: Number, default: 0 }      // Angka urutan terakhir
});

module.exports = mongoose.model('Counter', CounterSchema);