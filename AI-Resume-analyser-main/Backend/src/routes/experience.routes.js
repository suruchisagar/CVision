const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const experienceController = require('../controllers/experience.controller')

const experienceRouter = express.Router()

// Community posts can be browsed by anyone who has access to the app.
experienceRouter.get('/', experienceController.getAllExperiencesController)
experienceRouter.post('/', authMiddleware.authUser, experienceController.createExperienceController)

module.exports = experienceRouter
