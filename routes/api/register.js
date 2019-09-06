const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

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

router.get('/promote', async (req,res) => {
    try {

        res.render('register.ejs',{msg:'Register To See More'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }   
});

router.post('/', async (req,res) => {
    try {
        
        //User Details in User Obj
        const {username, password, password_c, name, about, dept, year, role} = req.body;
        try {

            if(password != password_c){
                return res.render('register.ejs',{msg:'Passwords do not match'})
            }
            if(password.length < 6){
                return res.render('register.ejs',{msg:'Password should be minimun 6 characters long'})
            }
            let existing = await User.findOne({username: username});
            if(existing){
                return res.render('register.ejs',{msg:'User Already Exits'});
            }else{
                console.log('Creating User Record...');

                let salt = bcrypt.genSaltSync(10);
                let hashedPassword = bcrypt.hashSync(password, salt);
                newUser = new User({
                    username, dept, year, name, password:hashedPassword, role, about
                });
                await newUser.save();    
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