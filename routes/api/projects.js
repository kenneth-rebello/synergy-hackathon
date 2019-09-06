const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Project = require('../../models/Project');
const User = require('../../models/User');

//Body Parser Middleware
router.use(express.json());
router.use(express.urlencoded({extended: true}));

//Get all projects without logging in
router.get('/', async function(req, res){
    try{
        noUser = {}
        noUser.logged= false;
        noUser.role ="";
        noUser.name ="";
        const projects = await Project.find({}).populate('uploader',['username', 'dept','year','name']);
        if(projects.length >0){     
            res.render('projects.ejs',{projects, user:noUser, msg:''});
        }else{
            res.render('projects.ejs',{projects, user:noUser, msg:'No Projects To Show'});
        }
        
    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//Get All Projects 
router.get('/:user', async function(req, res){
    try{

        let currentUser = await User.findOne({name:req.params.user});
        const projects = await Project.find().populate('uploader',['username', 'dept','year','name']);
        if(projects.length <= 0){     
            res.render('projects.ejs',{projects, user:currentUser, msg:'No Projects To Show'});
        }else{
            res.render('projects.ejs',{projects, user:currentUser, msg:''});
        }
        
    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/domain/:domain&:user', async function(req, res){
    try{

        let currentUser = await User.findOne({name:req.params.user});
        const projects = await Project.find({'domain': req.params.domain}).populate('uploader',['username', 'dept','year','name']);
        if(projects.length <= 0 && currentUser.logged){     
            res.render('projects.ejs',{projects, user:currentUser, msg:'No Projects To Show'});
        }else{
            res.render('projects.ejs',{projects, user:currentUser, msg:''});
        }

    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//Get Each Project
router.get('/project/:id/:user', async function(req, res){
    try{

        let currentUser = await User.findOne({name: req.params.user});
        const project = await Project.findOne({_id: req.params.id}).populate('uploader',['username','dept','year','name']);

        res.render('project.ejs',{project, user:currentUser});
        
    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/delete/:id/:user', async function(req, res){
    try{
     
        let currentUser = await User.findOne({name: req.params.user});
        const toDelete = await Project.findOne({_id: req.params.id});
        //Remove file from server public folder
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
        //Remove from database
        await Project.findOneAndRemove({_id: req.params.id});

        let projects = await Project.find().populate('uploader',['username', 'dept','year','name']);
        if(projects.length <= 0 && currentUser.logged){     
            res.render('projects.ejs',{projects, user:currentUser, msg:'No Projects To Show'});
        }else{
            res.render('projects.ejs',{projects, user:currentUser, msg:''});
        }
         
    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});

router.post('/search/:user', async (req, res) => {

    let currentUser = await User.findOne({name: req.params.user});
    let { keywords } = req.body;
    let current = await User.findOne({username:keywords});
    if(current){
        let projects = await Project.find({uploader:current._id}).populate('uploader',['username','dept', 'year','name']);
    
        if(projects.length>0){
            return res.render('user.ejs',{projects, profile:current, user:currentUser,msg:''});
        }else{
            res.render('user.ejs',{projects, profile:current, user:currentUser,msg:'No Projects To Show'})
        }
    }
    searchwords = keywords.split(',').map(word => word.trim());

    let projects = await Project.find({keywords: {$in: searchwords}}).populate('uploader',['username', 'dept','year','name']);;
    if(projects.length <= 0 && currentUser.logged){     
        res.render('projects.ejs',{projects, user:currentUser, msg:'No Projects To Show'});
    }else{
        res.render('projects.ejs',{projects, user:currentUser, msg:''});
    }
    
});

router.post('/filter/:user', async(req, res) => {

    let { dept, year, domain } = req.body;
    let currentUser = await User.findOne({name: req.params.user});

    let filters={}
    let domainCheck;
    
    if(dept != ""){
        filters.dept = dept;
    }
    if(domain != ""){
        domainCheck = domain;
    }else{
        domainCheck = ['Web','ML','IOT','DSA'];
    }
    if(year != ""){
        filters.year = year;
    }

    let creators = await User.find(filters)
    let publisher = [];
    creators.forEach( (creator) => {
        publisher.push(creator._id);
    });
    
    let projects = await Project.find({uploader : publisher, domain: {$in :domainCheck}}).populate('uploader',['username', 'dept','year','name']);
    res.render('projects.ejs',{projects, user:currentUser,msg:''});
});

//Filter without logging in
router.post('/filter', async(req, res) => {

    let { dept, year, domain } = req.body;

    let filters={}
    let domainCheck;
    if(dept != ""){
        filters.dept = dept;
    }
    if(domain != ""){
        domainCheck = domain;
    }else{
        domainCheck = ['Web','ML','IOT','DSA'];
    }
    if(year != ""){
        filters.year = year;
    }

    let users = await User.find(filters)
    let publisher = [];
    users.forEach( (user) => {
        publisher.push(user._id);
    });

    noUser = {}
    noUser.logged= false;
    noUser.role ="";
    noUser.name ="";
    
    let projects = await Project.find({uploader : {$in:publisher}, domain: {$in :domainCheck}}).populate('uploader',['username', 'dept','year','name']);
    res.render('projects.ejs',{projects, user:noUser ,msg:''});
});


router.post('/grade/:id/:user', async(req, res) => {

    let currentUser = await User.findOne({name: req.params.user});
    let project = await Project.findOne({_id: req.params.id});
    let { name, grade} = req.body;
    newGrade = { teacher: name, grade: grade}
    project.eval.push(newGrade);
    let updated = await Project.findOneAndUpdate({_id: project.id}, {eval: project.eval}, {new: true});
    let teacher = await User.findOne({name: name});
    teacher.graded.push(project._id);
    await User.findOneAndUpdate({name: name}, {graded: teacher.graded}, {new:true});

    res.render('project.ejs',{project:updated, user:currentUser})
});

router.get('/grade/remove/:id/:user', async(req, res) => {

    let currentUser = await User.findOne({name: req.params.user});
    let project = await Project.findOne({_id: req.params.id});
    newEval = project.eval.filter((eval)=>{ return eval.teacher!=currentUser.name});
    let updated = await Project.findOneAndUpdate({_id: project.id}, {eval: newEval}, {new: true});
    
    let teacher = await User.findOne({name: currentUser.name});
    newGraded = teacher.graded.filter((grade) => { return grade === project._id});
    await User.findOneAndUpdate({name: currentUser.name}, {graded: newGraded}, {new:true});

    res.render('project.ejs',{project:updated, user:currentUser})
});


module.exports = router;