const fs = require('fs');

//reading files from data.JSON file
//for tours
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../devdata/data/tours-simple.json`)
);

//handler functions
//for TOURS
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
}
exports.getTourById = (req, res) => {
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
exports.cretaeTour = (req,res) => {
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
exports.updateTour = (req, res) => {
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
exports.deleteTour = (req, res) => {
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