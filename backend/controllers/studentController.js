// controllers/studentController.js
const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching students' });
    }
};

// Get a student by identification number
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findOne({ identificationNumber: req.params.id });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student' });
    }
};

// Create a new student
exports.createStudent = async (req, res) => {
    const { firstName, lastName, semester, identificationNumber, dateOfBirth, dateOfAdmission, degreeTitle, yearOfStudy } = req.body;
    const uploadPicture = req.file ? req.file.filename : null;

    const newStudent = new Student({
        firstName,
        lastName,
        semester,
        identificationNumber,
        dateOfBirth,
        dateOfAdmission,
        degreeTitle,
        yearOfStudy,
        uploadPicture,
    });

    try {
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(500).json({ message: 'Error adding student' });
    }
};

// Update a student
exports.updateStudent = async (req, res) => {
    const { firstName, lastName, semester, dateOfBirth, dateOfAdmission, degreeTitle, yearOfStudy } = req.body;
    const uploadPicture = req.file ? req.file.filename : null;

    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { identificationNumber: req.params.id },
            { firstName, lastName, semester, dateOfBirth, dateOfAdmission, degreeTitle, yearOfStudy, uploadPicture },
            { new: true }
        );

        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json(updatedStudent);
    } catch (err) {
        res.status(500).json({ message: 'Error updating student' });
    }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
    try {
        const result = await Student.deleteOne({ identificationNumber: req.params.id });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Student not found' });
        res.status(204).end(); // No content
    } catch (err) {
        res.status(500).json({ message: 'Error deleting student' });
    }
};

// Check identification number for uniqueness
exports.checkIdentificationNumberExists = async (req, res) => {
    try {
        const student = await Student.findOne({ identificationNumber: req.params.id });
        if (student) return res.status(400).json({ message: 'Identification number already exists' });
        res.json({ message: 'Identification number is available' });
    } catch (err) {
        res.status(500).json({ message: 'Error checking identification number' });
    }
};
