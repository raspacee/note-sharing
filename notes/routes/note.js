const express = require("express");
const { unlink } = require("fs");
const { access, constants } = require("fs/promises");
const router = express.Router();
const Note = require("../schemas/Note");
const path = require("path");

let rootDir = __dirname.split("/");
rootDir.pop();
rootDir = rootDir.join("/");

const deleteFile = (filepath) => {
  unlink(filepath, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("File successfully deleted");
    }
  });
};

// Returns true if file exists otherwise returns false
const checkFileExists = (file) => {
  return access(path.join(rootDir, "uploads", file), constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

router.get("/notes/:courseID", async (req, res) => {
  // Sorting options
  const Options = {
    NEWEST: 0,
    MOST_LIKED: 1,
    OLDEST: 2,
  };

  const pageNo = req.query.p || 0;
  const sortBy = req.query.sort || 0;
  const RESULTS_PER_PAGE = 4;
  const total = await Note.count({ courseID: req.params.courseID });

  let results;
  if (sortBy == Options.OLDEST) {
    results = await Note.find({ courseID: req.params.courseID })
      .sort({ createdDate: 1 })
      .skip(pageNo * RESULTS_PER_PAGE)
      .limit(RESULTS_PER_PAGE);
  } else if (sortBy == Options.MOST_LIKED) {
    results = await Note.find({ courseID: req.params.courseID })
      .sort({ upvotes: 1 })
      .skip(pageNo * RESULTS_PER_PAGE)
      .limit(RESULTS_PER_PAGE);
  } else {
    results = await Note.find({ courseID: req.params.courseID })
      .sort({ createdDate: -1 })
      .skip(pageNo * RESULTS_PER_PAGE)
      .limit(RESULTS_PER_PAGE);
  }

  if (results.length === 0) {
    return res.status(404).send({
      message:
        "Sorry, notes are not available for that course. Maybe you can start by uploading them",
    });
  }
  return res.send({ results, total });
});

router.get("/note/:noteID", async (req, res) => {
  const note = await Note.findById(req.params.noteID);
  return res.status(200).send({ note });
});

router.get("/note/pdf/:pdfID", (req, res) => {
  checkFileExists(req.params.pdfID).then((exists) => {
    if (exists) {
      const options = {
        root: rootDir,
        dotfiles: "deny",
        headers: {
          "x-timestamp": Date.now(),
          "x-sent": true,
        },
      };

      res
        .status(200)
        .sendFile(path.join("uploads", req.params.pdfID), options, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(req.params.pdfID, "sent to client");
          }
        });
    } else {
      return res.status(404).send({ error: "File does not exist" });
    }
  });
});

router.post("/note", async (req, res) => {
  const { courseID, uploader, university, courseTitle } = req.body;
  const chapterNo = req.body.chapterNo ? req.body.chapterNo : null;
  const createdDate = new Date().toLocaleString();
  const note = new Note({
    courseID,
    chapterNo,
    file: req.file.filename,
    createdDate,
    uploader,
    university,
    courseTitle,
  });

  try {
    const result = await note.save();
    return res
      .status(200)
      .send({ message: "Successfully saved your pdf", result });
  } catch (err) {
    console.error(err);
    deleteFile(req.file.path);
    return res.send({
      message: "Error occured, check your input",
      error: err.errors,
    });
  }
});

router.put("/note", async (req, res) => {
  const { noteID, choice } = req.body;
  if ((choice !== "UPVOTE" && choice !== "DOWNVOTE") || !noteID) {
    return res
      .status(400)
      .send({ error: "noteID and choice fields missing/incorrect" });
  }
  let note;
  try {
    note = await Note.findById(noteID);
  } catch (err) {
    return res.status(200).send({ error: "Invalid note ID" });
  }

  if (!note) {
    return res.status(404).send({ error: "Note not found" });
  }

  if (choice === "UPVOTE") {
    for (let i = 0; i < note.upvotes.length; i++) {
      if (note.upvotes[i].by === req.ip) {
        note.upvotes.splice(i, 1);
        await note.save();
        return res.status(200).send({ message: "Undid your upvote" });
      }
    }
    note.upvotes.push({ by: req.ip });
    await note.save();
    return res.status(200).send({ message: "Upvote successful" });
  } else {
    for (let i = 0; i < note.downvotes.length; i++) {
      if (note.downvotes[i].by === req.ip) {
        note.downvotes.splice(i, 1);
        await note.save();
        return res.status(200).send({ message: "Undid your downvote" });
      }
    }
    note.downvotes.push({ by: req.ip });
    await note.save();
    return res.status(200).send({ message: "Downvote successful" });
  }
});

module.exports = router;
