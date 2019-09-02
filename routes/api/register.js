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
        
        //User Details in User Obj
        const {username, password, name, dept, year, role} = req.body;
        try {

            let existing = await User.findOne({username: username});
            if(existing){
                res.render('register.ejs',{msg:'User Already Exits'});
            }else{
                console.log('Creating User Record...');
                newUser = new User({
                    username, dept, year, name, password, role
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