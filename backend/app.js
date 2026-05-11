const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Book = require('./Book');
const User = require('./user');

const app = express();
const SECRET_KEY = "MAHMOUD_XP_SECRET";

// --- Global Middlewares ---
app.use(cors());
app.use(express.json());

// --- Auth Middlewares ---
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No Token Provided" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') next();
    else res.status(403).json({ success: false, message: "Access Denied: Admins Only" });
};

// --- [1. Auth Routes] ---

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, role });
        res.status(201).json({ success: true, message: "User Created" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, SECRET_KEY, { expiresIn: '1d' });
            res.json({ success: true, token, role: user.role, name: user.name });
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- [2. User Routes] ---

app.get('/api/books', protect, async (req, res) => {
    try {
        const books = await Book.find();
        res.json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/my-books', protect, async (req, res) => {
    try {
        // Books where borrowedBy matches the logged-in user's ID
        const myBooks = await Book.find({ borrowedBy: req.user.id });
        res.json({ success: true, data: myBooks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- [3. Admin Specialized Routes] ---

app.get('/api/admin/books', protect, adminOnly, async (req, res) => {
    try {
        const books = await Book.find().populate('borrowedBy', 'name email');
        res.json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/admin/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        const books = await Book.find();
        const data = users.map(u => {
            const uBooks = books.filter(b => b.borrowedBy && b.borrowedBy.toString() === u._id.toString());
            return { ...u._doc, borrowCount: uBooks.length, titles: uBooks.map(b => b.title) };
        });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/books', protect, adminOnly, async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json({ success: true, data: newBook });
    } catch (error) { res.status(400).json({ success: false, message: error.message }); }
});

// --- UPDATED: Admin Edit with Manual Borrowing ---
app.put('/api/books/:id', protect, adminOnly, async (req, res) => {
    try {
        const { isAvailable, borrowedBy, ...rest } = req.body;
        let updateData = { ...rest, isAvailable };

        // If admin sets status to Borrowed manually
        if (isAvailable === false || isAvailable === "false") {
            // Must have a user selected to link the book
            updateData.borrowedBy = borrowedBy || null;
        } else {
            // If admin sets to Available, clear the borrower
            updateData.borrowedBy = null;
        }

        const updatedBook = await Book.findOneAndUpdate(
            { id: parseInt(req.params.id) }, 
            updateData, 
            { new: true }
        ).populate('borrowedBy', 'name');

        if (!updatedBook) return res.status(404).json({ success: false, message: "Book not found" });
        res.json({ success: true, data: updatedBook });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.delete('/api/books/:id', protect, adminOnly, async (req, res) => {
    try {
        await Book.findOneAndDelete({ id: parseInt(req.params.id) });
        res.json({ success: true, message: "Deleted" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// --- [4. Borrowing & Returning Logic] ---

app.put('/api/books/borrow/:id', protect, async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            return res.status(403).json({ success: false, message: "Admins cannot borrow books!" });
        }
        const book = await Book.findOne({ id: parseInt(req.params.id) });
        if (!book || !book.isAvailable) return res.status(400).json({ message: "Book unavailable" });
        
        book.isAvailable = false;
        book.borrowedBy = req.user.id;
        await book.save();
        res.json({ success: true, message: "Borrowed successfully" });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/books/return/:id', protect, async (req, res) => {
    try {
        const book = await Book.findOne({ id: parseInt(req.params.id) });
        
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (book.borrowedBy && book.borrowedBy.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: This book is not assigned to you" });
        }

        book.isAvailable = true;
        book.borrowedBy = null;
        await book.save();
        
        res.json({ success: true, message: "Book returned successfully" });
    } catch (e) { 
        res.status(500).json({ message: e.message }); 
    }
});

module.exports = app;