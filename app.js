const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

//Middlewares
app.use(express.json());
app.use(morgan('dev'));

//reading files from data.JSON file
//for tours
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/devdata/data/tours-simple.json`)
);
//for users
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/devdata/data/users.json`)
);

//handler functions
//for TOURS
const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
}
const getTourById = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(ele => ele.id === id);
    if(!tour) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        });
    }
    res.status(200).json({
        status: 'success', 
        data: {
            tour
        }
    });
}
const cretaeTour = (req,res) => {
    const newId = tours[tours.length-1].id+1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/devdata/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
}
const updateTour = (req, res) => {
    if(req.params.id * 1 > tours.length) {
        res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here..>'
        }
    });
}
const deleteTour = (req, res) => {
    if(req.params.id * 1 > tours.length) {
        res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        });
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
}
//for USERS
const getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
}
const createUser = (req,res) => {
    const newId = users[users.length-1].id+1;
    const newUser = Object.assign({id: newId}, req.body);
    users.push(newUser);
    fs.writeFile(`${__dirname}/devdata/data/users.json`, JSON.stringify(users), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newUser
            }
        });
    });
}
const getUserById = (req, res) => {
    const id = req.params.id * 1;
    const user = users.find(ele => ele.id === id);
    if(!user) {
        return res.status(404).json({
            status: 'Fail',
            message: 'User Not Found'
        });
    }
    res.status(200).json({
        status: 'success', 
        data: {
            user
        }
    });
}
const updateUser = (req, res) => {
    if(req.params.id * 1 > users.length) {
        res.status(404).json({
            status: 'Fail',
            message: 'User Not Found'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated user here..>'
        }
    });
}
const deleteUser = (req, res) => {
    if(req.params.id * 1 > users.length) {
        res.status(404).json({
            status: 'Fail',
            message: 'User Not Found'
        });
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
}

//setting route for CRUD
const tourRoute = express.Router();
app.use('/api/v1/tours', tourRoute);
tourRoute.route('/') //for tours
         .get(getAllTours)
         .post(cretaeTour);
tourRoute.route('/:id') //for tour by id
         .get(getTourById)
         .patch(updateTour)
         .delete(deleteTour);

const userRoute = express.Router();
app.use('/api/v1/users', userRoute);
userRoute.route('/') // for users
         .get(getAllUsers)
         .post(createUser);
userRoute.route('/:id') // for user by id
         .get(getUserById)
         .patch(updateUser)
         .delete(deleteUser);

//connection portal
const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});