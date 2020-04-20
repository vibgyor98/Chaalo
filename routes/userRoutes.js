const fs = require('fs');
const express = require('express');
const router = express.Router();

//reading files from data.JSON file
//for users
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../devdata/data/users.json`)
);

//Handler Function
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
router.route('/') // for users
      .get(getAllUsers)
      .post(createUser);
router.route('/:id') // for user by id
      .get(getUserById)
      .patch(updateUser)
      .delete(deleteUser);

module.exports = router;