const express = require('express')
const app = express();

const databaseconnect = require('./config/databaseConfig');
const authRouter = require('./router/authRoute');

//connecting to the database
databaseconnect()
app.use(express.json()) // for parsing application/json
app.use('/api/auth/',authRouter )

module.exports = app