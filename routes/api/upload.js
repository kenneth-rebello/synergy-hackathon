const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Project = require('../../models/Project');
const Student = require('../../models/Student');
const user = require('../../public/config/default')


//Set Storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, next){
        next(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});
//Init Upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000}
}).array('project',2);

//Call Upload page
router.get('/', (req, res) => {
    res.render('upload.ejs',{msg:''});
});


//Make An Upload
router.post('/', (req, res)=>{
    upload(req, res, async (err) =>{
        if(!err){
            console.log('Success');
            

            //Project Details in Project Obj
            const newUpload = {};
            const {p_title, githubRepo, youtubeLink, desc, published, domain} = req.body;
            let file1 = req.files[0];
            let file2 = req.files[1];
            if(req.files.length >= 2){
                if(file1.mimetype == 'application/pdf'){
                    newUpload.reportName = file1.filename;
                    newUpload.pptName = file2.filename;
                    console.log(file1);
                }else if(file2.mimetype == 'application/pdf'){
                    newUpload.reportName = file2.filename;
                    newUpload.pptName = file1.filename;
                    console.log(file2);
                }
                else{
                    res.render('upload.ejs',{msg: 'Report of .pdf type required'})
                }
            }else{
                console.log(req);
                if(file1.mimetype == 'application/pdf'){
                    newUpload.reportName = file1.filename;
                }else{
                    res.render('upload.ejs',{msg: 'Report of .pdf type required'})
                }
                
            }
            console.log(user);
            let student = await Student.findOne({rollNo:user.rollNo})
            console.log(student);
            newUpload.title = p_title;
            newUpload.uploader = student._id
            newUpload.desc = desc;
            newUpload.keywords = desc.split(' ').map(word => word.trim());
            newUpload.published = published;
            newUpload.domain = domain;
            newUpload.githubRepo = githubRepo;
            if(youtubeLink){
                newUpload.youtubeLink = youtubeLink;
            };

            try {

                let existing = await Project.findOne({title: req.body.p_title, uploader: student._id});
                if(existing){
                    console.log('Updating Record...')
                    updatedEntry = await Project.findOneAndUpdate({_id: existing._id}, newUpload , {new:true});
                }else{
                    console.log('Creating Record...')
                    newEntry = new Project(newUpload);
                    await newEntry.save();    
                }

            } catch (err) {
                console.error(err.message);
            }

            res.render('upload.ejs',{msg:'Upload Successful'});
            
        }else{
            res.render('upload.ejs', {msg:err.message})
        }
    });
});




module.exports = router;