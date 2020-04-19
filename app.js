const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

//reading files from data.JSON file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/devdata/data/tours-simple.json`)
);

//handler functions
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

//get
// app.get('/api/v1/tours', getAllTours);

//get by id
app.get('/api/v1/tours/:id', getTourById);

//post or cretae tour
// app.post('/api/v1/tours', cretaeTour);

//patch or update by id
app.patch('/api/v1/tours/:id', updateTour);

// delete by id
app.delete('/api/v1/tours/:id', deleteTour);

//setting route
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(cretaeTour);

//connection portal
const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});