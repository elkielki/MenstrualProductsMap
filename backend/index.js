const dotenv = require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const app = express()

mongoose.connect(process.env.MONGO_URL)

app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))

app.use('/', require('./authRoutes'))

app.listen(5174, () => {
    console.log('Server is running')
});