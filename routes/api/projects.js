const express = require('express');
const router = express.Router();
const Project = require('../../models/Project');
const Student = require('../../models/Student');


//
router.get('/', async function(req, res){
    try{

        const uploads = await Project.find().populate('uploader',['rollNo', 'dept','year']);
        if(uploads){  
            
            res.render('projects.ejs', {uploads});
        }else{
            res.render('upload.ejs',{msg:'No Projects To Show'});
        }
        

    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async function(req, res){
    try{

        const uploads = await Project.find().populate('student',['rollNo', 'dept','year']);
        res.render('projects.ejs', {uploads});

    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/', async function(req, res){
    try{
        //Remove Profile
        await Project.findOneAndRemove({_id: req.body._id});
        //Remove User
        let check = await Project.findOne({uploader: req.body.uploader})
        if(!check){
            await Student.findOneAndRemove({_id: req.body.uploader});    
        }
         
        return res.json({msg: 'User removed'});
    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});

module.exports = router;