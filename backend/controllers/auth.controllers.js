const { generateJWT } = require("../helpers/jwt.helpers");
const { hashPassword } = require("../helpers/password.helpers");
const User = require("../models/user.model");

const { validationResult } = require("express-validator");

class AuthControllers {
  async register(req, res) {
    const { username, password, email } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(403).json({
        error: errors.array()[0],
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();

    const userJWT = await generateJWT(newUser._id);
    const userSession = {
      userID: newUser._id,
      JWT: userJWT,
    };

    req.session.user = userSession;

    res.status(201).json({ message: "User created", userSession });
  }

  async tmpSeeLoginData(req, res) {
    console.log(req.session.user);

    res.status(200).json({ message: "See console" });
  }
}

module.exports = new AuthControllers();
