const express = require('express');
const router = express.Router();
const user = require('../../public/config/default');


//Body Parser Middleware
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', async (req,res) => {
    try {
        
        res.render('login.ejs',{logged: user.logged});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {

    const {rollNo, password, admin} = req.body;
    try {

        currentUser = await Student.findOne({rollNo:rollNo});
        

        if(password !== currentUser.password){
            return res.render('login.ejs',{msg:'Incorrect password', logged:user.logged});
        }else{
            user.name = currentUser.name;
            user.logged = true;
            user.rollNo = currentUser.rollNo;
            user.dept = currentUser.dept;
            user.year = currentUser.year;
            user.name = currentUser.name;
            console.log(admin);
            if(admin){
                if(currentUser.admin){
                    user.admin = true;
                }else{
                    // res.send('Error 403: Forbidden');
                } 
            }else{
                user.admin = false;
            }
            res.render('index.ejs',{logged: user.logged, admin:user.admin});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.get('/register', async (req,res) => {
    try {
        
        res.render('register.ejs');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/register', async (req,res) => {
    try {
        
        //Student Details in Student Obj
        const {rollNo, password, name, dept, year} = req.body;
        try {

            let existing = await Student.findOne({rollNo: req.body.rollNo});
            if(existing){
                console.log('Student exists...')
            }else{
                console.log('Creating Student Record...')
                newStudent = new Student({
                    rollNo, dept, year, name, password
                });
                await newStudent.save();    
            }

        } catch (err) {
            console.error(err.message);
        }

        res.render('login.ejs',{logged: user.logged});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {

    const {rollNo, password, admin} = req.body;
    try {

        currentUser = await Student.findOne({rollNo:rollNo});
        

        if(password !== currentUser.password){
            res.render('login.ejs',{msg:'Incorrect password', logged:user.logged});
        }else{
            user.name = currentUser.name;
            user.logged = true;
            user.rollNo = currentUser.rollNo;
            user.dept = currentUser.dept;
            user.year = currentUser.year;
            user.name = currentUser.name;
            if(admin){
                user.admin = true;
            }
            res.render('index.ejs',{logged: user.logged, admin:user.admin});
        }
        

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;