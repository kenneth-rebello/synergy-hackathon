const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    username:{
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
        type: String,
        required: true
    },
    year:{
        type: Number,
        minimum: 0,
        maximum: 4
    },
    role:{
        type: String,
        default: 'student',
        required:true
    },
    logged:{
        type: Boolean,
        default: false
    },
    graded:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: 'project'
    }
});

module.exports = User = mongoose.model('user', userSchema);