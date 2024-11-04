const express = require('express');
const path = require('path');
const licenseRoutes = require('./routes/license');
const fs = require('fs'); // Required for file system operations


const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Set public folder for static files
app.use(express.static(path.join(__dirname, 'public')));



// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Clean the uploads and generated folders on restart (for development purposes)
// This should be commented out or handled differently in production
function cleanUploadsFolder() {
    const uploadDir = path.join(__dirname, 'uploads');
    const generatedDir = path.join(__dirname, 'public/generated');

    // Clean the uploads folder
    fs.readdir(uploadDir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(uploadDir, file), err => {
                if (err) throw err;
            });
        }
    });

    // Clean the generated folder
    fs.readdir(generatedDir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(generatedDir, file), err => {
                if (err) throw err;
            });
        }
    });
}

// Call the cleaning function at app start (development only)
// Comment or remove this function call in production as you may not want to delete user files
cleanUploadsFolder();

// Routes
app.use('/license', licenseRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('index', { title: 'Travel License', image: null });
});

// Error handling
app.use((req, res, next) => {
    res.status(404).render('error', { message: 'Page Not Found' });
});

// Listen to server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
