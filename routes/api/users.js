const express = require('express');
const router = express.Router();
const user = require('../../public/config/default');
const User = require('../../models/User');
const Project = require('../../models/Project');

//Body Parser Middleware
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/:name', async function(req, res){
    name = req.params.name;
    let current = await User.findOne({name:name});
    let projects = await Project.find({uploader:current._id}).populate('uploader',['username','dept', 'year','name']);
    
    if(projects.length>0){
        return res.render('user.ejs',{projects, user:name, name:user.name, logged:user.logged,role:user.role,msg:''});
    }else{
        res.render('user.ejs',{projects, user:name, name:user.name,logged:user.logged,role:user.role,msg:'No Projects To Show'})
    }
});

router.post('/filter/:name', async(req, res) => {

    let name = req.params.name;
    let { domain } = req.body;
    let domainCheck;

    if(domain != ""){
        domainCheck = domain;
    }else{
        domainCheck = ['Web','ML','IOT','DSA'];
    }

    let current = await User.findOne({name:name});

    let projects = await Project.find({uploader : current.id, domain: {$in :domainCheck}}).populate('uploader',['username', 'dept','year','name']);
    
    if(projects.length>0){
        return res.render('user.ejs',{projects, user:name, name:user.name, logged:user.logged,role:user.role,msg:''});
    }else{
        res.render('user.ejs',{projects, user:name, name:user.name,logged:user.logged,role:user.role,msg:'No Projects To Show'})
    }

    
});

module.exports = router;