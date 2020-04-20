const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//Middlewares
app.use(express.json());
app.use(morgan('dev'));

//Mounting Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//connection portal
const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});