const express = require('express');
const router = express.Router();
const user = require('../../public/config/default');

router.get('/',(req,res) => {
    user.logged = false;
    user.name = "";
    user.username = "";
    user.dept = "";
    user.year = "";
    user.role = 'student';

    try {
        res.render('index.ejs',{logged: user.logged, user:user.role, name:''});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;