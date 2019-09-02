const express = require('express');
const router = express.Router();
const user = require('../../public/config/default');
const User = require('../../models/User');

//Body Parser Middleware
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', async (req,res) => {
    try {
        
        res.render('login.ejs',{msg:''});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {

    const {username, password, role} = req.body;
    try {

        currentUser = await User.findOne({username:username});
        
        if(!currentUser){
            return res.render('login.ejs',{msg:'User does not exist'});
        }

        if(password !== currentUser.password){
            return res.render('login.ejs',{msg:'Incorrect password'});
        }
    
        if(role == 'admin'){

            if(currentUser.role == 'admin'){
                user.role = 'admin';
            }else{
                return res.render('login.ejs',{msg:'Not Authorized'});
            } 
        }else{
            user.role = role;
        }
        user.name = currentUser.name;
        user.logged = true;
        user.username = currentUser.username;
        user.dept = currentUser.dept;
        user.year = currentUser.year;
        user.name = currentUser.name;
        res.render('index.ejs',{logged: user.logged, role:user.role, name:user.name});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


module.exports = router;