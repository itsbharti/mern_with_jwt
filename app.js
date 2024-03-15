const express = require('express')
const cookieParser = require('cookie-parser')
const app = express();
const cors = require('cors')
app.use(cookieParser())


const databaseconnect = require('./config/databaseConfig');
const authRouter = require('./router/authRoute');

//connecting to the database
databaseconnect()
app.use(express.json()) // for parsing application/json
app.use(cors({origin:[process.env.CLIENT_URL], credentials:true}))
app.use('/api/auth/',authRouter )

module.exports = app