const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  semester: String,
  identificationNumber: String,
  dateOfBirth: Date,
  dateOfAdmission: Date,
  degreeTitle: String,
  yearOfStudy: String,
  uploadPicture: String // To store picture path or base64
});

module.exports = mongoose.model('Student', studentSchema);
