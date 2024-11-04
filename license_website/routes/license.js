const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateLicense } = require('../utils/licenseGenerator');

// Define the folder paths
const uploadsFolder = path.join(__dirname, '../uploads');
const publicFolder = path.join(__dirname, '../public');

// Track the last generated and uploaded image paths
let lastGeneratedImagePath = null;
let lastProfileImagePath = null;

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + path.basename(file.originalname, path.extname(file.originalname));
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route to clear uploads folder on page load
router.get('/clear-uploads', (req, res) => {
    fs.readdir(uploadsFolder, (err, files) => {
        if (err) {
            console.error('Error reading uploads folder:', err);
            res.status(500).json({ error: 'Could not clear uploads folder' });
            return;
        }

        files.forEach(file => {
            fs.unlink(path.join(uploadsFolder, file), err => {
                if (err) console.error('Error deleting file:', err);
            });
        });

        res.json({ success: true });
    });
});

// Route to generate a default license card with blank.png as the profile image
router.get('/generate-default', async (req, res) => {
    try {
        if (lastGeneratedImagePath && fs.existsSync(lastGeneratedImagePath)) {
            fs.unlinkSync(lastGeneratedImagePath);
        }

        const formData = {
            issuedTo: '',
            dob: '',
            placeOfIssue: '',
            dateOfIssue: '',
            backgroundColor: '#faefcf',
            signature: '',
            fontSelect: 'Arial',
            profileImagePath: path.join(publicFolder, 'blank.png'),
            stamp: 'blank' // Default to blank if no stamp selected
        };

        const generatedImagePath = await generateLicense(formData);
        lastGeneratedImagePath = generatedImagePath;

        res.json({ imagePath: `/generated/${path.basename(generatedImagePath)}` });
    } catch (error) {
        console.error('Error generating default license:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle the POST request to generate the license with provided data
router.post('/generate', upload.fields([{ name: 'profileImage', maxCount: 1 }]), async (req, res) => {
    try {
        if (lastGeneratedImagePath && fs.existsSync(lastGeneratedImagePath)) {
            fs.unlinkSync(lastGeneratedImagePath);
        }

        const formData = {
            issuedTo: req.body.issuedTo,
            dob: req.body.dob,
            placeOfIssue: req.body.placeOfIssue,
            dateOfIssue: req.body.dateOfIssue,
            backgroundColor: req.body.backgroundColor,
            signature: req.body.signature,
            fontSelect: req.body.fontSelect,
            profileImagePath: req.files.profileImage ? req.files.profileImage[0].path : path.join(publicFolder, 'blank.png'),
            stamp: req.body.stampSelect || 'blank' // Use selected stamp or default to 'blank'
        };

        // Handle profile image cleanup if a new one is uploaded
        if (req.files.profileImage) {
            if (lastProfileImagePath && fs.existsSync(lastProfileImagePath)) {
                fs.unlinkSync(lastProfileImagePath);
            }
            lastProfileImagePath = req.files.profileImage[0].path;
        }

        const generatedImagePath = await generateLicense(formData);
        lastGeneratedImagePath = generatedImagePath;

        res.json({ imagePath: `/generated/${path.basename(generatedImagePath)}` });
    } catch (error) {
        console.error('Error generating license:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
