const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    
    rollNo:{
        type: String,
        required: true
    },
    dept:{
        type: String
    },
    year:{
        type: Number,
        minimum: 1,
        maximum: 4
    }

});

module.exports = Student = mongoose.model('student', studentSchema);