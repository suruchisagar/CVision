const mongoose = require('mongoose')

const technicalQuestionSchema = new mongoose.Schema({
  question : {
    type : String,
    required:[ true , "Technical questions is required"]
  },
  intention : {
    type : String,
    required:[ true , "Intention is required"]
  },
  answer : {
    type : String,
    required:[ true , "Answer is required"]
  }
},{
  _id:false
})

const behavioralQuestionSchema = new mongoose.Schema({
  question : {
    type : String,
    required:[ true , "Technical questions is required"]
  },
  intention : {
    type : String,
    required:[ true , "Intention is required"]
  },
  answer : {
    type : String,
    required:[ true , "Answer is required"]
  }
},{
  _id:false
})

const skillGapSchema = new mongoose.Schema({
  skill:{
    type : String,
    required:[ true , "skill is required"]
  },
  severity: {
    type : String,
    enum:["low" , "medium" , "high"],
    required:[ true , "Severity is required"]
  }
},
{
  _id:false
})

const preparationPlanSchema =  new mongoose.Schema({
  day: {
    type:Number,
    required : true
  },
  focus:{
    type : String,
    required :[true , "Focus is required"]
  },
  task: [{
    type : String,
    required:[ true , "task is required"]
  }]
})

const requirementEvidenceSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  required: { type: Boolean, required: true },
  weight: { type: Number, required: true },
  matched: { type: Boolean, required: true },
  jobEvidence: { type: String, required: true },
  candidateEvidence: { type: String, default: null },
}, { _id: false })

const interviewReportSchema = new mongoose.Schema({
  jobDescription : {
    type:String,
    required:[true , "Job description is required"]
  },
  resume : {
    type:String,
  },
  selfDescription:{
    type:String,
  },
  matchScore:{
    type: Number,
    min : 0,
    max : 100
  },
  scoringMethod: { type: String, default: 'weighted_skill_coverage_v1' },
  requirementEvidence: [requirementEvidenceSchema],
  technicalQuestions : [technicalQuestionSchema],
  behavioralQuestions : [behavioralQuestionSchema],
  skillGaps : [skillGapSchema],
  preparationPlan : [preparationPlanSchema],
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users"
  },
  title : {
    type : String,
    required : [true , "job title is required"]
  }
},{
  timestamps:true
})

interviewReportSchema.index({ user: 1, createdAt: -1, _id: -1 })

const interviewReportModel = mongoose.model("InterviewReport",interviewReportSchema)

module.exports = interviewReportModel
