const express = require('express');
const path = require('path');
const fs = require('fs');
const licenseRoutes = require('./routes/license');

const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Set public folder for static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create the directories if they don't exist
const directories = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'public/generated')
];

directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`${dir} created`);
    }
});

// Safely clean the folder (with error handling)
function safeCleanFolder(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(`Error reading ${directoryPath}:`, err);
            return; // Prevents crashing the app
        }
        for (const file of files) {
            fs.unlink(path.join(directoryPath, file), err => {
                if (err) console.error(`Error deleting file ${file} in ${directoryPath}:`, err);
            });
        }
    });
}

// Clean the folders on app start (for development only)
safeCleanFolder(path.join(__dirname, 'uploads'));
safeCleanFolder(path.join(__dirname, 'public/generated'));

// Routes
app.use('/license', licenseRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('index', { title: 'Travel License', image: null });
});

// Error handling for 404 - Page Not Found
app.use((req, res, next) => {
    res.status(404).render('error', { message: 'Page Not Found' });
});

// Listen to server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
