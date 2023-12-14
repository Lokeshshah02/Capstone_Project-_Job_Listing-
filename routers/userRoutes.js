const express = require('express');
const { signUp, logIn, healthApi} = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');
const { jobPost, updateJobPost, filterBySkills, getJobDescription } = require('../controllers/jobController');


const router = express.Router();

router.post('/signup',signUp)

router.post('/login',logIn)

router.post('/jobpost',jobPost )

router.put('/updatejobpost', updateJobPost)

router.get('/filteredposts', filterBySkills)

router.get('/getJobDesc',getJobDescription)


module.exports = router