const express = require('express');
const router = express.Router();
const user = require('../../public/config/default');

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

    const {rollNo, password, admin} = req.body;
    try {

        currentUser = await Student.findOne({rollNo:rollNo});
        

        if(password !== currentUser.password){
            return res.render('login.ejs',{msg:'Incorrect password'});
        }else{
            if(admin){
                if(currentUser.admin){
                    user.admin = true;
                }else{
                    res.render('login.ejs',{msg:'Not Authorized'});
                } 
            }else{
                user.admin = false;
            }
            user.name = currentUser.name;
            user.logged = true;
            user.rollNo = currentUser.rollNo;
            user.dept = currentUser.dept;
            user.year = currentUser.year;
            user.name = currentUser.name;
            res.render('index.ejs',{logged: user.logged, admin:user.admin});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


module.exports = router;