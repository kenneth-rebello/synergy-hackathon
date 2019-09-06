const express = require('express');
const router = express.Router();
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

        let currentUser = await User.findOne({username:username});
        
        if(!currentUser){
            return res.render('login.ejs',{msg:'User does not exist'});
        }

        if(password !== currentUser.password){
            return res.render('login.ejs',{msg:'Incorrect password'});
        }
    
        
        if(currentUser.role == role){
            currentUser = await User.findOneAndUpdate({_id:currentUser._id},{logged:true},{new:true});
            res.render('index.ejs',{user:currentUser});    
        }else{
            return res.render('login.ejs',{msg:'Not Authorized'});
        } 
    
        
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


module.exports = router;