const app = require('./app');
const connectDB = require('./db');

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('-------------------------------------------');
        console.log(`🚀 Server is running on: http://localhost:${PORT}`);
        console.log(`✅ MongoDB Atlas Connection: Established`);
        console.log('-------------------------------------------');
        console.log(`🔗 Press Ctrl+C to stop the server`);
    });
}).catch(err => {
    console.error('❌ Failed to start server due to DB error:', err.message);
});