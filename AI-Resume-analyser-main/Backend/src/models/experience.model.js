const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 100,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: 100,
    },
    experience: {
      type: String,
      required: [true, 'Interview experience is required'],
      trim: true,
      maxlength: 10000,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  { timestamps: true },
)

experienceSchema.index({ createdAt: -1, _id: -1 })

module.exports = mongoose.model('InterviewExperience', experienceSchema)
