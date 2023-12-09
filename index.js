const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const  router  = require("./routers/userRoutes");
// const userRoutes = require("./routers/userRoutes");
const errorhandler = require("./middleware/errorhandler");
const userRoutes = require("./routers/userRoutes");

const app = express();
app.use(express.json());
app.use(errorhandler)



app.use(bodyParser.urlencoded({ extended: false }));

// app.use("/", (req, res, next) => {
//   res.status(200).json({
//     message: "Hello World!!",
//   });
// });

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
