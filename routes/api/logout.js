const express = require('express');
const router = express.Router();
const User = require('../../models/User');

router.get('/:name', async(req,res) => {
   
    let currentUser = await User.findOneAndUpdate({name: req.params.name},{logged:false},{new:true});

    try {
        res.render('index.ejs',{logged: currentUser.logged, role:currentUser.role, name:''});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;