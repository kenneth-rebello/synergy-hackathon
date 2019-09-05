const express = require('express');
const connectDB = require('./db');
const ejs = require('ejs');
const User = require('./models/User');
connectDB();

//Init app
const app = express();

app.use(express.static('./public'));


app.set('view engine', ejs);

app.get('/', (req, res) => {
    return res.render('index.ejs',{logged:false, role:"", name:""});
});

app.get('/logged/:user', async (req, res) => {

    token = req.params.user;
    let currentUser = await User.findOne({name:token});

    res.render('index.ejs',{logged:currentUser.logged, role:currentUser.role, name:currentUser.name});
});

app.use('/upload', require('./routes/api/upload'));
app.use('/projects', require('./routes/api/projects'));
app.use('/login', require('./routes/api/login'));
app.use('/logout', require('./routes/api/logout'));
app.use('/register', require('./routes/api/register'));
app.use('/report', require('./routes/api/report'));
app.use('/users', require('./routes/api/users'));

const port = 5000;
app.listen(port, () => console.log(`Server started on ${port}`));