const asyncHandler = require("../middleware/asyncHandler");
const dotenv = require("dotenv");
const job = require("../model/jobSchema");
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

//create job-post
const jobPost = asyncHandler(async (req, res) => {
  //1. token is getting validated before creating a job post
  const {
    // recruiterName,
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

  let skillsArray = skills;
  if(typeof skills === "string"){
      skillsArray=skills.split(',').map(skill => skill.trim())
  }

  if (
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
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const newJob = await job.create({
    companyName,
    addLogoUrl,
    jobPosition,
    monthlySalary,
    jobType,
    remote,
    location,
    jobDescription,
    aboutCompany,
    skills: skillsArray,
    information,
  });

  if (newJob) {
    res
      .status(201)
      .json({ message: "Job successfully Posted", _id: newJob.id });
  } else {
    res.status(400);
    throw new Error("Invalid Job data");
  }
});


const updateJobPost = asyncHandler(async (req, res, next) => {
  try {
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

    const { _id } = req.query;
    console.log("receiver id", _id);
    if (!_id) {
      return res
        .status(400)
        .json({ message: "Invalid request. Missing job post ID." });
    }
    const existingPost = await job.findById(_id);
    if (!existingPost) {
      return res.status(404).json({ message: "Job post not found." });
    }
    const updatedPost = await job.findByIdAndUpdate(
      _id,
      {
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
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Updated successfully",

      _id: updatedPost.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const filterBySkills = asyncHandler(async(req,res)=>{

  const {jobPosition, skills} = req.query;

  let query = {}

  if(jobPosition){
    query.jobPosition = jobPosition;
  }

  if(skills){
    query.skills = { $in : skills.split("&")};
  }
  console.log(query)
  const jobPost = await job.find(query).sort({createdAt: -1})
  if(jobPost){
    res.status(200).json({jobPost})
  }else{
    res.status(400)
    throw new Error("Job post not found")
  }
   
})

//get a single job description
const getJobDescription = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  try {
    const fetchJobDesc = await job.findById(_id);
    if (!fetchJobDesc) {
      res.status(404).json({ message: "Job Description not found!" });
      return;
    }
    const { jobDescription } = fetchJobDesc;
    res.status(200).json({
      message: "success",
      fetchJobDesc: { _id, jobDescription },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

//get all jobs
const getAllJobs = asyncHandler(async (req, res) => {
  try {
    const allJobs = await job.find().sort({ _id: -1 });
    console.log("all jobs", allJobs);

    const extractedJobs = allJobs.map((job) => ({
      _id: job._id,
      companyName: job.companyName,
      addLogoUrl: job.addLogoUrl,
      jobPosition: job.jobPosition,
      monthlySalary: job.monthlySalary,
      jobType: job.jobType,
      remote: job.remote,
      location: job.location,
      jobDescription: job.jobDescription,
      aboutCompany: job.aboutCompany,
      skills: job.skills,
      information: job.information,
    }));

    res.status(200).json({
      message: "success",
      job: extractedJobs,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

//View job details
const viewJobDetails = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  console.log('Received _id:', _id); // Log the _id parameter

  try {
    const fetchJobDesc = await job.findById(_id);
    if (!fetchJobDesc) {
      res.status(404).json({ message: "Job Description not found!" });
      return;
    }
    const {
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
    } = fetchJobDesc;

    res.status(200).json({
      message: "success",
      jobPosts: {
        _id,
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
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

//get a single job post
const singleJobPost = asyncHandler(async(req,res)=>{
  const{_id} = req.query

  const fetchJob = await job.findOne({_id})
  if(!fetchJob){
    res.status(400)
      throw new Error({message:"Job post not found with given id"})
    }else{
      res.status(200).json({message: "SUCCESS", fetchJob})
    }
  
})

module.exports = {
  jobPost,
  updateJobPost,
  filterBySkills,
  getJobDescription,
  viewJobDetails,
  getAllJobs,
  singleJobPost
};
