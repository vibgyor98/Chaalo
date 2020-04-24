const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const dotenv = require('dotenv')
dotenv.config({ path: './config.env'}) //first chk the env

//connecting database
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(con => {
    console.log('DB Connection Successful');
});

//Read Json File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//Import data into Database
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data Successfully loaded');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

//Delete all data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data Successfully deleted');
        process.exit();
    } catch (err) {
        console.log(err);
    }   
}

//command line process
if(process.argv[2] === '--import') {
    importData();
} else if(process.argv[2] === '--delete') {
    deleteData();
}

//ecexuting node command
console.log(process.argv);