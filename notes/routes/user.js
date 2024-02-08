const express = require("express");
const router = express.Router();
const User = require("../schemas/User");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();
  password = password.trim();
  email = email.trim();

  if (password.length <= 7) {
    return res
      .status(400)
      .send({ error: "Password should be atleast 8 characters long" });
  }

  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegexp.test(email)) {
    return res.status(400).send({ error: "Invalid email provided" });
  }

  if (firstName != "" && lastName != "" && password != "") {
    // Check if a user with the same email is already available
    User.findOne({ email: email }).then((user) => {
      if (user) {
        return res.status(400).send({ error: "Email is already in use" });
      }
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, async function (err, hash) {
        if (err) {
          return res.status(400).send({
            error: "Something wrong occured while hashing your password",
          });
        }
        try {
          const joinedDate = new Date().toLocaleString();
          const user = new User({
            firstName,
            lastName,
            email,
            password: hash,
            joinedDate: joinedDate,
          });
          await user.save();
          return res
            .status(201)
            .send({ message: "User successfully created. You can login now." });
        } catch (err) {
          return res.status(400).send({ error: err });
        }
      });
    });
  } else {
    return res
      .status(400)
      .send({ error: "firstName, lastName or password is missing" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email == "" || password == "") {
    return res.status(400).send({ error: "Missing fields email or password" });
  }
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    bcrypt.compare(password, user.password, function (err, matched) {
      if (err) {
        return res
          .status(500)
          .send({ error: "Something occured while checking passwords" });
      }
      if (matched) {
        return res.status(200).send();
      } else {
        return res
          .status(401)
          .send({ error: "Email or password may be wrong" });
      }
    });
  });
});

module.exports = router;
