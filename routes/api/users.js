const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Project = require('../../models/Project');

//Body Parser Middleware
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/:name&:user', async function(req, res){

    let currentUser = await User.findOne({name: req.params.user});
    let user = [req.params.name];
    let profile = await User.findOne({name:req.params.name});
    let projects=[]
    if(profile.role=='student'){
        projects = await Project.find({uploader:profile._id}).populate('uploader',['username','dept', 'year','name']);
    }else if(profile.role=='teacher'){
        projects = await Project.find({mentor: {$in: user}}).populate('uploader',['username','dept', 'year','name']);
    }
    
    if(projects.length>0){
        return res.render('user.ejs',{projects, user:currentUser, profile, msg:''});
    }else{
        res.render('user.ejs',{projects, user:currentUser, profile, msg:'No Projects To Show'})
    }
});

router.post('/filter/:name&:user', async(req, res) => {

    let currentUser = await User.findOne({name: req.params.user});
    let { domain } = req.body;
    let domainCheck;
    let user = [req.params.name]
    if(domain != ""){
        domainCheck = domain;
    }else{
        domainCheck = ['Web','ML','IOT','DSA'];
    }

    let profile = await User.findOne({name:req.params.name});
    
    let projects = [];
    if(profile.role=='student'){
        projects = await Project.find({uploader:profile._id, domain:domainCheck}).populate('uploader',['username','dept', 'year','name']);
    }else if(profile.role=='teacher'){
        projects = await Project.find({mentor: {$in: user}, domain:domainCheck}).populate('uploader',['username','dept', 'year','name']);
    }
    
    if(projects.length>0){
        return res.render('user.ejs',{projects, profile, user:currentUser, msg:''});
    }else{
        res.render('user.ejs',{projects, profile, user:currentUser ,msg:'No Projects To Show'})
    }

});

router.get('/update/:name', async (req,res) => {
    try {
        let profile = await User.findOne({name:req.params.name});
        res.render('updateProfile.ejs',{user:profile,msg:'Please Note: Account name can NOT be changed.'});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});

router.post('/update/:user', async (req, res) => {
    
    let profile = await User.findOne({name:req.params.user});
    let {username, about, dept, year} = req.body;

    let existing = await User.findOne({username:username});
    if(existing && username!=profile.username){
        return res.render('updateProfile.ejs',{user:profile,msg:'Username already taken, please choose another'});
    }
    let update = {}
    if(username != ''){
        update.username = username;
    }
    if(about != ''){
        update.about = about;
    }
    if(dept != ''){
        update.dept = dept;
    }
    if(year != ''){
        update.year = year;
    }

    let newProfile = await User.findOneAndUpdate({name:req.params.user}, update, {new:true});
    let projects = await Project.find({uploader:newProfile._id});

    let mentors = [newProfile.name];
    if(newProfile.role=='student'){
        projects = await Project.find({uploader:newProfile._id}).populate('uploader',['username','dept', 'year','name']);
    }else if(newProfile.role=='teacher'){
        projects = await Project.find({mentor: {$in: mentors}}).populate('uploader',['username','dept', 'year','name']);
    }
    
    if(projects.length>0){
        return res.render('user.ejs',{projects,profile:newProfile, user:newProfile, msg:'Changes Saved'});
    }else{
        res.render('user.ejs',{projects, profile:newProfile, user:newProfile, msg:'Changes Saved. No Projects To Show'})
    }

});
module.exports = router;