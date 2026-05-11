const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    categories: [String]
});

module.exports = mongoose.model('Book', bookSchema);