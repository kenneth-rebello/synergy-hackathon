const express = require('express');
const router = express.Router();
const pdf = require('html-pdf');
const user = require('../../public/config/default')
const Project = require('../../models/Project');

//Body Parser Middleware
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/generate', async function (req, res){
    try {
        res.render('generate.ejs',{logged:user.logged, role:user.role, name:user.name, msg:''})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async function(req, res){
    if(user.role == 'admin'){
        let filter = {};
        let { username, date, domain, dept, year} = req.body;
        
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

        let projects = await Project.find({uploader : publisher, domain: {$in :domainCheck}}).populate('uploader',['username', 'dept','year','name']);
        console.log(projects);
        res.render('report.ejs',{projects, report:"", date, username}, async (err, data) => {
            let report = "report"+Date.now()+".pdf";
            pdf.create(data).toFile("./public/reports/"+report, async (err)=>{
                if(err){
                    res.send(err.message);
                }else{
                    console.log('File created');
                    res.render('report.ejs',{projects, report: report, date, username});
                }
            });
        });
    }else{
        res.send('Error 401: Not Authorized')
    }
});

module.exports = router;