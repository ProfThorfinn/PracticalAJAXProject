const express = require('express');
const cors = require('cors');
const Book = require('./Book'); // الموديل بتاعك

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
// [GET] جلب كل الكتب
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// [GET] كتاب واحد
app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findOne({ id: parseInt(req.params.id) });
        if (!book) return res.status(404).json({ success: false, message: "Not Found" });
        res.json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// [POST] إضافة
app.post('/api/books', async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json({ success: true, data: newBook });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// [PUT] تعديل
app.put('/api/books/:id', async (req, res) => {
    try {
        const updated = await Book.findOneAndUpdate({ id: parseInt(req.params.id) }, req.body, { new: true });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// [DELETE] حذف
app.delete('/api/books/:id', async (req, res) => {
    try {
        await Book.findOneAndDelete({ id: parseInt(req.params.id) });
        res.json({ success: true, message: "Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = app;