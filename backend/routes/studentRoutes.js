// routes/studentRoutes.js
const express = require('express');
const multer = require('multer');
const {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    checkIdentificationNumberExists
} = require('../controllers/studentController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Save files with a unique name
    }
});

const upload = multer({ storage }); // Use the storage configuration

// Routes
router.post('/', upload.single('uploadPicture'), createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', upload.single('uploadPicture'), updateStudent);
router.delete('/:id', deleteStudent);
router.get('/check/:id', checkIdentificationNumberExists);

module.exports = router;
