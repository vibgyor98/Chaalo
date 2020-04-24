const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({ path: './config.env'}) //first chk the env

//then proceed to app
const app = require('./app');

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


//connecting server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});