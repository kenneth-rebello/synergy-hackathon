const mongoose = require('mongoose');
const db = "mongodb://localhost/projectDB";

const connectDB = async () => {
    try{
        await mongoose.connect(db,{
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
        });

        console.log('MongoDB Connected')
    }catch(err){
        console.error(err.message);
        //EXIT PROCESS WITH FAILURE
        process.exit(1);
    }
}

module.exports = connectDB;