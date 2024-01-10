const express = require('express');
const { signUp, logIn, healthApi} = require('../controllers/userController');
const { jobPost, updateJobPost, filterBySkills, getJobDescription, viewJobDetails, getAllJobs, singleJobPost } = require('../controllers/jobController');
const validateTokenHandler = require('../middleware/validateTokenHandler');


const router = express.Router();

router.post('/signup',signUp)

router.post('/login',logIn)

router.post('/jobpost',validateTokenHandler,jobPost )

router.put('/updatejobpost', updateJobPost)

router.get('/filteredposts', filterBySkills)

router.get('/getJobDesc',getJobDescription)

router.get("/viewjobdetails", viewJobDetails)

router.get("/getalljobs", getAllJobs)

router.get("/fetchJobPost", singleJobPost)



module.exports = router