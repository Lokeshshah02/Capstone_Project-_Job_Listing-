const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    // },
    recruiterName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    companyName: {
      type: String,
      required: true,
    },
    addLogoUrl: {
      type: String,
      required: true,
    },

    jobPosition: {
      type: String,
      required: true,
    },
    monthlySalary: {
      type: Number,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME"],
      required: true,
    },
    remote: {
      type: String,
      enum: ["REMOTE", "OFFICE"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    aboutCompany: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    information: {
      type: String,
      required: true,
    },
  },
  {
    timestramps: true,
  }
);


module.exports = mongoose.model('job', jobSchema)