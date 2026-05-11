const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    categories: [String],
    isAvailable: { type: Boolean, default: true },
    // الربط مع موديل المستخدم
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

module.exports = mongoose.model('Book', bookSchema);