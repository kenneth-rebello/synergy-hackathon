const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    
    // rollNo is the username
    rollNo:{
        type: String,
        required: true
    },
    name:{
        type: String,
    },
    password:{
        type: String,
        required: true,
    },
    dept:{
        type: String,
        required: true,
    },

});

module.exports = Admin = mongoose.model('admins', adminSchema);