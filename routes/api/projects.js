const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Project = require('../../models/Project');
const Student = require('../../models/Student');


//
router.get('/', async function(req, res){
    try{

        const uploads = await Project.find().populate('uploader',['rollNo', 'dept','year']);
        console.log(uploads);
        if(uploads == []){     
            res.render('projects.ejs',{msg:'No Projects To Show'});
        }else{
            res.render('projects.ejs',{uploads});
        }
        

    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// // ML
// router.get('/ml', async function(req, res){
//     try{

//         const uploads = await Project.find({'domain': "ML"}).populate('uploader',['rollNo', 'dept','year']);
//         console.log(uploads);
//         if(uploads == []){     
//             res.render('projects.ejs',{msg:'No Projects To Show'});
//         }else{
//             res.render('projects.ejs',{uploads});
//         }
        

//     }catch(err){
        
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // WB
// router.get('/ml', async function(req, res){
//     try{

//         const uploads = await Project.find({'domain': "WB"}).populate('uploader',['rollNo', 'dept','year']);
//         console.log(uploads);
//         if(uploads == []){     
//             res.render('projects.ejs',{msg:'No Projects To Show'});
//         }else{
//             res.render('projects.ejs',{uploads});
//         }
        

//     }catch(err){
        
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // DSA
// router.get('/ml', async function(req, res){
//     try{

//         const uploads = await Project.find({'domain': "DSA"}).populate('uploader',['rollNo', 'dept','year']);
//         console.log(uploads);
//         if(uploads == []){     
//             res.render('projects.ejs',{msg:'No Projects To Show'});
//         }else{
//             res.render('projects.ejs',{uploads});
//         }
        

//     }catch(err){
        
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // IOT
// router.get('/ml', async function(req, res){
//     try{

//         const uploads = await Project.find({'domain': "IOT"}).populate('uploader',['rollNo', 'dept','year']);
//         console.log(uploads);
//         if(uploads == []){     
//             res.render('projects.ejs',{msg:'No Projects To Show'});
//         }else{
//             res.render('projects.ejs',{uploads});
//         }
        

//     }catch(err){
        
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// router.get('/:id', async function(req, res){
//     try{

//         const project = await Project.findOne({_id: req.params.id}).populate('uploader',['rollNo','dept','year']);
//         res.render('project.ejs',project);

//     }catch(err){
        
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

router.get('/delete/:id', async function(req, res){
    try{

        
        const toDelete = await Project.findOne({_id: req.params.id});
        //Remove file from server public folder
        console.log(typeof(toDelete.reportName));
        fs.unlinkSync(path.join(__dirname,'/../../public/uploads/',toDelete.reportName), (err) => {
            if(err){
                throw err;
            }
        })
        if(toDelete.pptName){
            fs.unlinkSync(path.join(__dirname,'/../../public/uploads/',toDelete.pptName), (err) => {
                if(err){
                    throw err;
                }
            });
        }
        await Project.findOneAndRemove({_id: req.params.id});


        let uploads = await Project.find().populate('uploader',['rollNo', 'dept','year']);
        if(uploads != []){  
            res.render('projects.ejs', {uploads});
        }else{
            res.render('upload.ejs',{msg:'No Projects To Show'});
        }
         
    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});


module.exports = router;