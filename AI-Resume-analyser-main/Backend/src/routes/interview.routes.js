const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const interviewController = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')

const interviewRouter = express.Router()


/**
 * @route POST /
 * @description generate the interview report by resume , self description and job description
 * @access public
 */
interviewRouter.post(
  '/',
  authMiddleware.authUser,
  upload.single('resume'),
  interviewController.generateInterviewReportController
)

/**
 * @route GEt /report/:interviewId
 * @description get the interview report by interview id
 * @access private
 */
interviewRouter.get(
  '/report/:interviewId',
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController
)

/**
 * @route GET / 
 * @description get all the interview report by the loggged in user
 * @access private
 */
interviewRouter.get(
  '/',
  authMiddleware.authUser,
  interviewController.getAllInterviewReportaController
)

/**
 * @route POST /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and jpb description
 * @access private
 */

interviewRouter.post(
  '/resume/pdf/:interviewReportId',
  authMiddleware.authUser,
  interviewController.generateResumePdfController
)

module.exports = interviewRouter
