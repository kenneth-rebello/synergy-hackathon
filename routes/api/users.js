const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Project = require('../../models/Project');

//Body Parser Middleware
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/:user&:name', async function(req, res){

    let currentUser = await User.findOne({name: req.params.name});
    let user = [req.params.user];
    let profile = await User.findOne({name:req.params.user});
    let projects=[]
    if(profile.role=='student'){
        projects = await Project.find({uploader:profile._id}).populate('uploader',['username','dept', 'year','name']);
    }else if(profile.role=='teacher'){
        projects = await Project.find({mentor: {$in: user}}).populate('uploader',['username','dept', 'year','name']);;
    }
    
    if(projects.length>0){
        return res.render('user.ejs',{projects, user:req.params.user, name:currentUser.name, logged:currentUser.logged,role:currentUser.role,msg:''});
    }else{
        res.render('user.ejs',{projects, user:req.params.user, name:currentUser.name,logged:currentUser.logged,role:currentUser.role,msg:'No Projects To Show'})
    }
});

router.post('/filter/:user&:name', async(req, res) => {

    let currentUser = await User.findOne({name: req.params.name});
    let { domain } = req.body;
    let domainCheck;

    if(domain != ""){
        domainCheck = domain;
    }else{
        domainCheck = ['Web','ML','IOT','DSA'];
    }

    let profile = await User.findOne({name:req.params.user});
    let projects = await Project.find({uploader : profile.id, domain: {$in :domainCheck}}).populate('uploader',['username', 'dept','year','name']);
    
    if(projects.length>0){
        return res.render('user.ejs',{projects, user:profile.name, name:currentUser.name, logged:currentUser.logged, role:currentUser.role,msg:''});
    }else{
        res.render('user.ejs',{projects, user:profile.name, name:currentUser.name, logged:currentUser.logged, role:currentUser.role,msg:'No Projects To Show'})
    }

    
});

module.exports = router;