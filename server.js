const dotenv = require('dotenv')
dotenv.config({ path: './config.env'}) //first chk the env

//then proceed to app
const app = require('./app');

//connecting server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});