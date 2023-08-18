require('dotenv').config()
const express = require("express");
const connectDB = require('./db');
const routes = require("./routes")
const app = express()
const PORT = process.env.PORT || 8001;

// const crypto = require('crypto');
// const secretKey = crypto.randomBytes(64).toString('hex');
// console.log(secretKey);

//* Middleware for parsing JSON and urlencoded form data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//* Connect to MongoDB
connectDB()

//* Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Book Review System API');
})
app.use(routes)

app.listen(PORT, () => {
    console.log(`server running on port http://localhost:${PORT}`)
})