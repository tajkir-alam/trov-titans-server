const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;
require('dotenv').config()

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('server is working')
})

app.listen(port, () => {
    console.log("Server is running on port: ", port);
})