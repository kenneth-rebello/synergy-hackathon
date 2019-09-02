const express = require('express');
const router = express.Router();
const user = require('../../public/config/default');

//Body Parser Middleware
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', async (req,res) => {
    try {

        res.render('register.ejs',{msg:''});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }   
});

router.post('/', async (req,res) => {
    try {
        
        //Student Details in Student Obj
        const {rollNo, password, name, dept, year} = req.body;
        try {

            let existing = await Student.findOne({rollNo: rollNo});
            if(existing){
                res.render('register.ejs',{msg:'User Already Exits'});
            }else{
                console.log('Creating Student Record...');
                newStudent = new Student({
                    rollNo, dept, year, name, password
                });
                await newStudent.save();    
            }

        } catch (err) {
            console.error(err.message);
        }

        res.render('login.ejs',{msg:'Please Login To Proceed'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;