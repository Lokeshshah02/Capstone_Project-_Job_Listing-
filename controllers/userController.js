const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv')
const jwt = require("jsonwebtoken");

dotenv.config()

const User = require("../model/userSchema");

const errorHandler = (res, error) =>{
  console.error(error);
  res.status(500).json({ error : 'Internal Server Error'})
}

const signUp = asyncHandler ( async (req, res) => {
    try {
      console.log("Received signup request:", req.body);
      const { recruiterName,userName, email, password,phone } = req.body;
      if(!recruiterName || !userName || !email|| !password || !phone){
        return res.status(400).json({ error : 'All fields are required'})
      }
      const encryptedPassword = await bcrypt.hash(password, 10);
  
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: "FAILED",
          message: "Email is already registered",
        });
      }
  
      // Create a new user
      const newUser = new User({
        recruiterName,
        userName,
        email,
        password: encryptedPassword,
        phone,
      });
      await newUser.save();
      console.log("User saved:", newUser);
      res.json({
        status: "SUCCESS",
        message: "You've signed up successfully!",
        recruiterName:newUser.recruiterName
      });
    } catch (error) {
      console.error(error);
      errorHandler(res, error)
    }
  });

const logIn = asyncHandler (async (req, res) => {
  console.log("Received login request:", req.body);
    try {
      const { email, password } = req.body;
      if(!email || !password){
        return res.status(400).json({ error : 'All fields are required'})
      }
      const user = await User.findOne({ email });
      console.log(user);
      if (user) {
        let hasPasswordMatched = await bcrypt.compare(password, user.password);
  
        if (hasPasswordMatched) {
          const jwtToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
            expiresIn: 60 * 30,
          });
          res.json({
            status: "SUCCESS",
            message: "You've logged In successfully!",
            jwtToken,
            recruiterName:user.recruiterName

          });
        } else {
          res.json({
            status: "FAILED",
            message: "Oops! wrong credentials.",
          });
        }
      } else {
        res.json({
          status: "FAILED",
          message: "No User Found",
        });
      }
    } catch (error) {
      console.error(error);
      errorHandler(res, error)
    }
  });



  module.exports ={ signUp, logIn}
  