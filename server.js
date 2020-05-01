const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); //first chk the env

//Handle all Unhandle promise rejection
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shuting Down Server');
  console.log(err.name, err.message);
  process.exit(1);
});

//then proceed to app
const app = require('./app');

//connecting database
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB Connection Successful');
  })
  .catch((err) => console.log('ERROR'));

//connecting server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

//Handle all Unhandle promise rejection
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shuting Down Server');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
