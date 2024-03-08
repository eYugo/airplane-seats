import { Router } from "express";
import { createUser } from "../daos/dao-users.js";
import passport from "passport";
import { check, validationResult } from "express-validator";

const router = Router();

/*** Users APIs ***/

// Route to register the user
router.post(
  "/register",
  [
    check("email").isString().withMessage("Invalid email"),
    check("name").isString(),
    check("password").isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await createUser(req.body);
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        res.status(201).json({ username: user.username });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Route to performing login
router.post("/login", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info });
    }
    req.login(user, (err) => {
      if (err) return next(err);

      return res.json(req.user);
    });
  })(req, res, next);
});

// Route to check whether the user is logged in or not.
router.get("/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

// Route to log out the current user.
router.delete("/current", (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});

export { router };
