const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local");

const { UserModel } = require("../model/UserModel");

const router = express.Router();

passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = new UserModel({ username, email });
    await UserModel.register(user, password);
    res.json({ success: true, message: "User registered" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  if (!user) return res.status(400).json({ success: false, message: "User not found" });

  user.authenticate(password, (err, userModel, passwordErr) => {
    if (err || passwordErr) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token, username });
  });
});

module.exports = router;
