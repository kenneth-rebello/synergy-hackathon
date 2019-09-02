const express = require('express');
const connectDB = require('./db');
const ejs = require('ejs');
const user = require('./public/config/default');
connectDB();

//Init app
const app = express();

app.use(express.static('./public'));


app.set('view engine', ejs);
app.get('/', (req, res) => {res.render('index.ejs',{logged:user.logged, role:user.role, name:user.name})});

app.use('/upload', require('./routes/api/upload'));
app.use('/projects', require('./routes/api/projects'));
app.use('/login', require('./routes/api/login'));
app.use('/logout', require('./routes/api/logout'));
app.use('/register', require('./routes/api/register'));

const port = 5000;
app.listen(port, () => console.log(`Server started on ${port}`));