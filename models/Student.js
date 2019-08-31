const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    
    rollNo:{
        type: String,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    password:{
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
    },
    admin:{
        type: Boolean,
        required: true,
        default: false
    },

});

module.exports = Student = mongoose.model('student', studentSchema);