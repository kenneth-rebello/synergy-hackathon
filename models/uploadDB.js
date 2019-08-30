const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    reportName:{
        type: String,
    },
    title:{
        type: String
    },
    pptName:{
        type: String,
    },
    uploader:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    field:{
        type: String,
        required: true
    },
    dateOfUpload:{
        type: String,
        default: Date.now() 
    },
    youtubeLink:{
        type: String,
    },
    githubRepo:{
        type: String
    },
    keywords:{
        type:[String],
        required: true
    },
    published:{
        type: Boolean,
        required: true
    }
});

module.exports = Upload = mongoose.model('uploads', uploadSchema);
