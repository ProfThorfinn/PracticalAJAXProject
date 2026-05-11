const app = require('./app');
const connectDB = require('./db');
const open = (...args) => import('open').then(({default: open}) => open(...args));
const PORT = 3000;


connectDB().then(() => {
    app.listen(PORT, async () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        try {
            await open(`http://localhost:${PORT}/landing.html`);
            console.log('Browser opened automatically!');
        } catch (err) {
            console.error('Failed to open browser:', err);
        }
    });
});
