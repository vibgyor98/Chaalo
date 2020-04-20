const dotenv = require('dotenv')
const app = require('./app');

dotenv.config({ path: './config.env'})
// console.log(process.env);

//connection portal
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});