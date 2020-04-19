const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Hello from Chaalo');
});
app.post('/', (req,res) => {
    res.status(200).send('You can post to this site')
})
const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});