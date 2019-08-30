const express = require('express');
const connectDB = require('./db');
const ejs = require('ejs');
connectDB();

//Init app
const app = express();

app.use(express.static('./public'));


app.set('view engine', ejs);
app.get('/', (req, res) => res.render('index.ejs'));

app.use('/upload', require('./routes/api/upload'));
app.use('/projects', require('./routes/api/projects'));
app.use('/student', require('./routes/api/student'));

const port = 5000;
app.listen(port, () => console.log(`Server started on ${port}`));