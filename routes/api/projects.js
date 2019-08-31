const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Project = require('../../models/Project');
const Student = require('../../models/Student');
const user = require('../../public/config/default');
const pdf = require('pdfkit');
const createPDF = require('../../public/config/Pdf');

//Body Parser Middleware
router.use(express.json());
router.use(express.urlencoded({extended: true}));

//Get all projects
router.get('/', async function(req, res){
    try{

        const uploads = await Project.find().populate('uploader',['rollNo', 'dept','year','name']);
        console.log(uploads);
        if(uploads == []){     
            res.render('projects.ejs',{msg:'No Projects To Show',logged:user.logged, admin:user.admin});
        }else{
            res.render('projects.ejs',{uploads,logged:user.logged, admin:user.admin});
        }
        

    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ML
router.get('/ml', async function(req, res){
    try{

        const uploads = await Project.find({'domain': "ML"}).populate('uploader',['rollNo', 'dept','year','name']);
        console.log(uploads);
        if(uploads == []){     
            res.render('projects.ejs',{msg:'No Projects To Show', admin:user.admin});
        }else{
            res.render('projects.ejs',{uploads,logged:user.logged, admin:user.admin});
        }
        

    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// WEB
router.get('/web', async function(req, res){
    try{

        const uploads = await Project.find({'domain': "WEB"}).populate('uploader',['rollNo', 'dept','year','name']);
        console.log(uploads);
        if(uploads == []){     
            res.render('projects.ejs',{msg:'No Projects To Show', admin:user.admin});
        }else{
            res.render('projects.ejs',{uploads,logged:user.logged, admin:user.admin});
        }
        

    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DSA
router.get('/dsa', async function(req, res){
    try{

        const uploads = await Project.find({'domain': "DSA"}).populate('uploader',['rollNo', 'dept','year','name']);
        console.log(uploads);
        if(uploads == []){     
            res.render('projects.ejs',{msg:'No Projects To Show', admin:user.admin});
        }else{
            res.render('projects.ejs',{uploads,logged:user.logged, admin:user.admin});
        }
        

    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// IOT
router.get('/iot', async function(req, res){
    try{

        const uploads = await Project.find({'domain': "IOT"}).populate('uploader',['rollNo', 'dept','year','name']);
        console.log(uploads);
        if(uploads == []){     
            res.render('projects.ejs',{msg:'No Projects To Show', admin:user.admin});
        }else{
            res.render('projects.ejs',{uploads,logged:user.logged, admin:user.admin});
        }
        

    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/report', async function(req, res){
    if(user.admin){
        let projects = await Project.find().populate('uploader',['rollNo', 'dept','year','name']);
        createPDF(projects);
        console.log(projects);
        res.render('index.ejs',{logged: user.logged, admin:user.admin});
    }else{
        res.send('Error 401: Not Authorized')
    }
});

router.get('/:id', async function(req, res){
    try{

        console.log(user);
        const project = await Project.findOne({_id: req.params.id}).populate('uploader',['rollNo','dept','year','name']);
        console.log(project);
        res.render('project.ejs',{project, admin:user.admin});

    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

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


        let uploads = await Project.find().populate('uploader',['rollNo', 'dept','year','name']);
        if(uploads != []){  
            res.render('projects.ejs', {uploads,logged:user.logged, admin:user.admin});
        }else{
            res.render('upload.ejs',{msg:'No Projects To Show'});
        }
         
    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});

router.post('/search', async (req, res) => {

    let { keywords } = req.body;
    searchwords = keywords.split(',').map(word => word.trim());

    let results = await Project.find({keywords: {$elemMatch: {keywords:searchwords}}});
    console.log(results);
    console.log('searched');
    res.render('projects.ejs',{uploads:results, logged:user.logged, admin:user.admin});
});


module.exports = router;