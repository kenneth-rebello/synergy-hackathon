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
        ref: 'user'
    },
    domain:{
        type: String,
        required: true
    },
    eval:[{
        teacher:{
            type: String,
        },
        grade:{
            type: String
        }
    }],
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
    },
    mentor:{
        type:[String]
    },
    team:{
        type:[String]
    }
});

module.exports = Project = mongoose.model('project', projectSchema);
