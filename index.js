const express = require('express');

const app = express();

// GET
app.get('/', (req, res) => {
    res.send('Hello');
})


// PORT
const port = 8888;
app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`)
})