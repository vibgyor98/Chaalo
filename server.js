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

//mongoose schema
const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
});

//Models
const Tour = mongoose.model('Tour', tourSchema);

//connecting server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});