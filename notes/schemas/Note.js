const mongoose = require("mongoose");
const { Schema } = mongoose;

const noteSchema = new Schema({
  courseID: {
    type: String,
    required: [true, "courseID is required"],
    minLength: 2,
    maxLength: 30,
  },
  courseTitle: {
    type: String,
    required: [true, "course title is required"],
    minLength: 3,
    maxLength: 100,
  },
  chapterNo: {
    type: Number,
    min: [1, "chapterNo can't be less than 1"],
    max: [30, "chapterNo can't be more than 30"],
    default: null,
  },
  file: { type: String, required: true },
  uploader: { type: String, required: true },
  createdDate: { type: String, default: Date.toLocaleString, required: true },
  upvotes: [{ by: String }],
  downvotes: [{ by: String }],
  university: {
    type: String,
    minLength: 3,
    required: [true, "university is required"],
  },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
