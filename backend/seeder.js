const mongoose = require('mongoose');
const fs = require('fs');
const Book = require('./book'); // اتأكد إن الاسم book.js بالظبط

const seedData = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/libraryDB');
        console.log('📡 Connected!');

        console.log('📖 Reading JSON file...');
        const data = fs.readFileSync('./books.json', 'utf-8');
        const books = JSON.parse(data);

        console.log('🗑️ Clearing old data...');
        await Book.deleteMany();

        console.log('🚀 Inserting new books...');
        await Book.insertMany(books);

        console.log('✅ Done! Database Seeded.');
        process.exit(); // لازم تخرج عشان السكريبت ميفضلش متعلق
    } catch (error) {
        console.error('❌ Error details:', error.message);
        process.exit(1);
    }
};

seedData();