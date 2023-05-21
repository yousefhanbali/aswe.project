require('dotenv').config("./.env");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const databaseConnection = require('./database/connection.js');

app.set('db',databaseConnection);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const loginRouter = require('./routers/login.js');
app.use('/', loginRouter);

const signUpRouter = require('./routers/signup.js');
app.use('/',signUpRouter);

const jobsRouter = require('./routers/jobs.js');
app.use('/', jobsRouter);

const LinkedInAPI = require('./routers/LinkedInAPI.js');
app.use('/LinkedInAPI', LinkedInAPI);
const IndeedAPI = require('./routers/IndeedAPI.js');
app.use('/IndeedAPI', IndeedAPI);
const salaryApi = require('./routers/JobSalaryDataAPI.js');
app.use('/salaryApi', salaryApi);

app.listen(port, () => {
  console.log("API running on localhost on " + port);
});