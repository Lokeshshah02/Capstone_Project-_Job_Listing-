const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    // },
    recruiterName: {
      type: String,
      // required: true,
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
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
      enum:["part-time", "full-time"],
      required: true,
    },
    remote: {
      type: String,
      enum:["remote", "office"],
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
      type:[String],
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


// const jobSchema = new mongoose.Schema({
//     recruiterName:{
//         type:String,
//         // required: [true, "please enter recruiter name"]
//     },
//     companyName:{
//         type:String,
//         // required: [true, "please enter company name"]
//     },
//     addLogoUrl : {
//         type:String,
//         // required: [true, "please enter addLogoUrl"]
//     },
//     jobPosition:{
//         type:String,
//         // required: [true, "please enter jobPosition"]
//     },
//     monthlySalary:{
//         type:Number,
//         // required: [true, "please enter MonthlySalary"]
//     },
//     jobType:{
//         type:"String",
//         enum:["part-time", "full-time"],
//         // required: [true, "please enter jobType"]
//     },
//     remote:{
//         type:"String",
//         enum:["remote", "office"],
//         // required: [true, "please choose remote/office "]
//     },
//     location:{
//         type:String,
//         // required: [true, "please enter jobPosition"]
//     },
//     aboutCompany:{
//         type:String,
//         // required: [true, "please enter company details"]
//     },
//     jobDescription:{
//         type:String,
//         // required: [true, "please enter job description"]
//     },
//     skills:{
//         type:[String],
//         // required: [true, "please enter skills"]
//     },
//     information:{
//         type:String,
//         // required: [true, "please enter information"]
//     }
// },
// {
//     timestamps: true,
// }
// )

module.exports = mongoose.model('job', jobSchema)