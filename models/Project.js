const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    reportName:{
        type: String,
    },
    title:{
        type: String
    },
    pptName:{
        type: String,
    },
    desc:{
        type:String,
    },
    uploader:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    domain:{
        type: String,
        required: true
    },
    grade:{
        type: String,
    },
    dateOfUpload:{
        type: Date,
        default: Date() 
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

module.exports = Project = mongoose.model('project', projectSchema);
