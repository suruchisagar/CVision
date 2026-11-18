const express = require('express');
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express();

const passport = require('passport');
require('./config/passport');
app.use(passport.initialize()); 

app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials:true
}))

// require all the routes here
const authRoutes = require('./routes/auth.routes.js');
const interviewRouter = require('./routes/interview.routes.js');
const experienceRouter = require('./routes/experience.routes.js');

// using the routes here
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRouter);
app.use('/api/experiences', experienceRouter);


module.exports = app;
