const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  project: {
    type: String,
    trim: true,
    select: false,
  },
  issue_title: {
    type: String,
    trim: true,
  },
  issue_text: {
    type: String,
    trim: true,
  },
  created_by: {
    type: String,
    trim: true,
  },
  assigned_to: {
    type: String,
    default: '',
    trim: true,
  },
  status_text: {
    type: String,
    default: '',
    trim: true,
  },
  open: {
    type: Boolean,
    default: true,
  },
}, {
  collection: process.env.MONGO_COLLECTION,
  versionKey: false,
  timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
  },
});

module.exports = mongoose.model('Project', projectSchema);
