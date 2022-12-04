const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const AuthControllers = require("../controllers/auth.controllers");

router.post(
  "/register",
  [
    body("email")
      .notEmpty()
      .withMessage("required")
      .isEmail()
      .withMessage("pattern")
      .trim()
      .normalizeEmail(),
    body("username")
      .notEmpty()
      .withMessage("required")
      .isLength({ min: 3 })
      .withMessage("minLength")
      .trim(),
    body("password")
      .notEmpty()
      .withMessage("required")
      .isLength({ min: 8 })
      .withMessage("minLength")
      .trim(),
    body("cpassword").notEmpty().withMessage("required").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("nomatch");
      }
      return true;
    }),
  ],
  AuthControllers.register
);

router.get("/tmp", AuthControllers.tmpSeeLoginData);

module.exports = router;
