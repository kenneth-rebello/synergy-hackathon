const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Project = require('../../models/Project');
const User = require('../../models/User');
const user = require('../../public/config/default');

//Body Parser Middleware
router.use(express.json());
router.use(express.urlencoded({extended: true}));

//Get all projects
router.get('/', async function(req, res){
    try{

        const projects = await Project.find().populate('uploader',['username', 'dept','year','name']);
        if(projects.length <= 0){     
            res.render('projects.ejs',{projects, name:user.name, logged:user.logged, role:user.role, msg:'No Projects To Show'});
        }else{
            res.render('projects.ejs',{projects, name:user.name,logged:user.logged, role:user.role, msg:''});
        }
        
    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/domain/:domain', async function(req, res){
    try{

        domain = req.params.domain;
        console.log(req.params.domain)
        const projects = await Project.find({'domain': domain}).populate('uploader',['username', 'dept','year','name']);
        if(projects.length <= 0 && user.logged){     
            res.render('projects.ejs',{projects, name:user.name, logged:user.logged, role:user.role, msg:'No Projects To Show'});
        }else{
            res.render('projects.ejs',{projects, name:user.name,logged:user.logged, role:user.role, msg:''});
        }

    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



router.get('/:id', async function(req, res){
    try{

        const project = await Project.findOne({_id: req.params.id}).populate('uploader',['username','dept','year','name']);
        res.render('project.ejs',{project, name:user.name, logged:user.logged, role:user.role});

    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/delete/:id', async function(req, res){
    try{
     
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
        if(projects.length <= 0 && user.logged){     
            res.render('projects.ejs',{projects, name:user.name, logged:user.logged, role:user.role, msg:'No Projects To Show'});
        }else{
            res.render('projects.ejs',{projects, name:user.name,logged:user.logged, role:user.role, msg:''});
        }
         
    }catch(err){
        
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});

router.post('/search', async (req, res) => {

    let { keywords } = req.body;
    let current = await User.findOne({username:keywords});
    if(current){
        let projects = await Project.find({uploader:current._id}).populate('uploader',['username','dept', 'year','name']);
    
        if(projects.length>0){
            return res.render('user.ejs',{projects, user:current.name, name:user.name, logged:user.logged,role:user.role,msg:''});
        }else{
            res.render('user.ejs',{projects, user:current.name, name:user.name,logged:user.logged,role:user.role,msg:'No Projects To Show'})
        }
    }
    searchwords = keywords.split(',').map(word => word.trim());

    let projects = await Project.find({keywords: {$in: searchwords}}).populate('uploader',['username', 'dept','year','name']);;
    if(projects.length <= 0 && user.logged){     
        res.render('projects.ejs',{projects, name:user.name, logged:user.logged, role:user.role, msg:'No Projects To Show'});
    }else{
        res.render('projects.ejs',{projects, name:user.name,logged:user.logged, role:user.role, msg:''});
    }
    
});

router.post('/filter', async(req, res) => {
    let { username, dept, year, domain } = req.body;
    

    let filters={}
    let domainCheck;
    if(username){
        filters.username = username;
    }
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
    
    let projects = await Project.find({uploader : publisher, domain: {$in :domainCheck}}).populate('uploader',['username', 'dept','year','name']);
    res.render('projects.ejs',{projects, name:user.name,logged:user.logged,role:user.role,msg:''});
});

router.post('/grade/:id', async(req, res) => {

    let project = await Project.findOne({_id: req.params.id});
    let { name, grade} = req.body;
    newGrade = { teacher: name, grade: grade}
    project.eval.push(newGrade);
    let updated = await Project.findOneAndUpdate({_id: project.id}, {eval: project.eval}, {new: true});
    let teacher = await User.findOne({name: name});
    teacher.graded.push(project._id);
    await User.findOneAndUpdate({name: name}, {graded: teacher.graded}, {new:true});

    res.render('project.ejs',{project:updated, name:user.name, logged:user.logged, role:user.role})
});

router.get('/grade/remove/:id', async(req, res) => {

    let project = await Project.findOne({_id: req.params.id});
    newEval = project.eval.filter((eval)=>{ return eval.teacher!=user.name});
    let updated = await Project.findOneAndUpdate({_id: project.id}, {eval: newEval}, {new: true});
    
    let teacher = await User.findOne({name: user.name});
    newGraded = teacher.graded.filter((grade) => { return grade === project._id});
    await User.findOneAndUpdate({name: user.name}, {graded: newGraded}, {new:true});

    res.render('project.ejs',{project:updated, name:user.name, logged:user.logged, role:user.role})
});


module.exports = router;