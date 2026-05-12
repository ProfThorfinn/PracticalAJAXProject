require('dotenv').config(); 
const mongoose = require('mongoose');
const fs = require('fs');
const Book = require('./book'); 

const seedData = async () => {
    try {
        console.log('⏳ Connecting to MongoDB Atlas...');
        
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in .env file");
        }
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📡 Connected to Cloud Database!');

        console.log('📖 Reading JSON file...');
        const data = fs.readFileSync('./books.json', 'utf-8');
        const books = JSON.parse(data);

        console.log('🗑️ Clearing old data...');
        await Book.deleteMany();

        console.log('🚀 Inserting new books into Atlas...');
        await Book.insertMany(books);

        console.log('✅ Done! Database Seeded Successfully.');
        process.exit(0); 
    } catch (error) {
        console.error('❌ Error details:', error.message);
        process.exit(1);
    }
};

seedData();