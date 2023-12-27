const asyncHandler = require("../middleware/asyncHandler");
const dotenv = require("dotenv");
const job = require("../model/jobSchema");
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema")

//create job-post
const jobPost = asyncHandler(async(req,res)=>{

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
      information} = req.body;  

      let skillsArray = skills;
      if(typeof skills === "string"){
          skillsArray= skills.split(',').map(skill => skill.trim())
      }

      if( !companyName || !addLogoUrl || !jobPosition || !monthlySalary || !jobType || !remote ||!location || !jobDescription || !aboutCompany || !skills || !information){
          res.status(400)
          throw new Error("Please enter all the fields")
      }      
    
  const newJob = await job.create({
      companyName,addLogoUrl,jobPosition,monthlySalary,jobType,remote,location,jobDescription,aboutCompany,skills,information
  })

  if(newJob){
      res.status(201).json({message:"Job successfully Posted", _id : newJob.id})
  }else{
      res.status(400)
      throw new Error("Invalid Job data")
  }
})


// const jobPost = asyncHandler(async (req, res,) => {
//   try {
//     const {
//       // recruiterName,
//       companyName,
//       addLogoUrl,
//       jobPosition,
//       monthlySalary,
//       jobType,
//       remote,
//       location,
//       jobDescription,
//       aboutCompany,
//       skills,
//       information,
//     } = req.body;
// console.log("job post :",req.body)
//     // Validate the user's token
//     const { jwttoken } = req.headers;
//     console.log("received token", jwttoken)

//     if (!jwttoken) {
//       return res.status(401).json({ message: "Token not provided" });
//     }

//     // Remove the "Bearer " prefix from the token
//     const tokenWithoutBearer = jwttoken.replace("Bearer ", "");

//     let userData;
//     try {
//       userData = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
//     } catch (error) {
//       console.error("JWT verification error:", error);
//       return res.status(401).json({
//         status: "FAILED",
//         message: "Invalid Token",
//       });
//     }

//     const userId = userData._id;
//     // Check if a job post already exists for the given userId
//     const existingJob = await job.findOne({ userId });

//     if (existingJob) {
//       return res.status(400).json({ message: "Job post already exists" });
//     }

//     // Validate other fields
//     if (
//       // !recruiterName ||
//       !companyName ||
//       !addLogoUrl ||
//       !jobPosition ||
//       !monthlySalary ||
//       !jobType ||
//       !remote ||
//       !location ||
//       !jobDescription ||
//       !aboutCompany ||
//       !skills ||
//       !information
//     ) {
//       return res.status(400).json({ message: "Please enter all the fields" });
//     }
//         console.log("Fields:", companyName, addLogoUrl, jobPosition, monthlySalary, jobType, remote, location, jobDescription, aboutCompany, skills, information);


//     // Create a new job post
//     const newJob = await job.create({
//       // userId,
//       // recruiterName,
//       companyName,
//       addLogoUrl,
//       jobPosition,
//       monthlySalary,
//       jobType,
//       remote,
//       location,
//       jobDescription,
//       aboutCompany,
//       skills,
//       information,
//     });
//     console.log("created job", newJob)

//     if (newJob) {
//       return res.status(201).json({
//         message: "Job post successfully posted",
//         _id: newJob.id,
//       });
//     } else {
//       return res.status(400).json({ message: "Invalid job data" });
//     }
//   } catch (err) {
//     throw new Error("some thing went wrong!");
//   }
// });



//update job-post
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

//fliter job post by skills
const filterBySkills = asyncHandler(async (req, res) => {
  try {
    const { skills, jobPosition } = req.query;
    console.log("skills :", skills, jobPosition);

    if (!skills || !jobPosition) {
      return res.status(400).json({
        message: "Skills and jobPosition are required parameters",
      });
    }

    const matchingData = await job.find({
      $or: [
        { skills: { $in: Array.isArray(skills) ? skills : [skills] } },
        {
          jobPosition: {
            $in: Array.isArray(jobPosition) ? jobPosition : [jobPosition],
          },
        },
      ],
    });

    console.log("matchingSkills and positions :", matchingData);

    if (matchingData.length === 0) {
      res.status(404).json({
        message: "No post found related to provided skills and jobPosition",
      });
    } else {
      res.status(200).json({
        message: "successful",
        data: matchingData,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

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
      fetchJobDesc: { _id, jobDescription},
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
    const allJobs = await job.find();
    console.log("all jobs",allJobs)

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
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

//View job details
const viewJobDetails = asyncHandler(async (req, res) => {
  const { _id } = req.query;
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


module.exports = { jobPost, updateJobPost, filterBySkills, getJobDescription , viewJobDetails, getAllJobs};
