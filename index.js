const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose")
const errorhandler = require("./middleware/errorhandler");
const userRoutes = require("./routers/userRoutes");
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(errorhandler)

//Middleware -Cors
app.use(cors());
//Middleware - parse Json reuest body
app.use(bodyParser.json());

//Middleware - parse urlencoded reuest body
app.use(bodyParser.urlencoded({ extended: false }));

//test route
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Hello World!!",
  });
});
 
//Health Api
app.get('/health',(req,res)=>{
  try {
    const serverName = "Job Listing Platform";
    const currentTime = new Date().toLocaleString();
    const serverStatus = "active";

    const healthInfo = {
      serverName,
      currentTime,
      serverStatus,
    };
    res.json(healthInfo);
  } catch (err) {
    throw new Error({ })
  }
});


// Router initial point
app.use('/user', userRoutes)

//
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("App connected to database");
    app.listen(process.env.PORT || 4000, () => {
      console.log(
        `Server is connected on http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
