const express = require('express');
const router = express.Router();
const user = require('../../public/config/default');

router.get('/',(req,res) => {
    user.logged = false;
    user.name = "";
    user.rollNo = "";
    user.dept = "";
    user.year = "";

    try {
        res.render('index.ejs',{logged: user.logged});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;