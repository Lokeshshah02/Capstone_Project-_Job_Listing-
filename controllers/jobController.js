const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const job = require("../model/jobSchema");
const jwt = require("jsonwebtoken");

const jobPost = asyncHandler(async (req, res, next) => {
  const {
    recruiterName,
    companyName,
    addLogoUrl,
    jobPosition,
    monthlySalary,
    jobType,
    remote,
    location,
    jobDescription,
    aboutCompany,
    skills,
    information,
  } = req.body;

  // Validate the user's token
  const { jwttoken } = req.headers;
  console.log("receiver token", jwttoken)

  if (!jwttoken) {
    return res.status(401).json({ message: "Token not provided" });
  }

  // Remove the "Bearer " prefix from the token
  const tokenWithoutBearer = jwttoken.replace("Bearer ", "");

  let userData;
  try {
    userData = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({
      status: 'FAILED',
      message: "Invalid State"
    });
  }

  const userId = userData._id;
  // Check if a job post already exists for the given userId
  const existingJob = await job.findOne({ userId });

  if (existingJob) {
    return res.status(400).json({ message: "Job post already exists" });
  }

  // Validate other fields
  if (
    !recruiterName ||
    !companyName ||
    !addLogoUrl ||
    !jobPosition ||
    !monthlySalary ||
    !jobType ||
    !remote ||
    !location ||
    !jobDescription ||
    !aboutCompany ||
    !skills ||
    !information
  ) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }

  // Create a new job post
  const newJob = await job.create({
    userId,
    recruiterName,
    companyName,
    addLogoUrl,
    jobPosition,
    monthlySalary,
    jobType,
    remote,
    location,
    jobDescription,
    aboutCompany,
    skills,
    information,
  });

  if (newJob) {
    return res.status(201).json({
      message: "Job post successfully posted",
      _id: newJob.id,
    });
  } else {
    return res.status(400).json({ message: "Invalid job data" });
  }
});

module.exports = jobPost;
