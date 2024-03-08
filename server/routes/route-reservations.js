import { Router } from "express";
import {
  getReservations,
  getAllReservations,
  deleteReservation,
  createReservation,
} from "../daos/dao-reservations.js";
import { check, validationResult } from "express-validator";

const router = Router();

/*** Middlewares ***/

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authenticated" });
}

function isAuthorized(req, res, next) {
  if (req.user.id == req.params.id) {
    return next();
  }
  return res.status(403).json({ error: "Not authorized" });
}

/*** Reservations APIs ***/

// Route to create a new reservation
router.post(
  "/",
  [
    isLoggedIn,
    check("airplane_type").isString(),
    check("row").isInt(),
    check("col").isString(),
    check("user_id").isInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reservation = {
      airplane_type: req.body.airplane_type,
      row: req.body.row,
      col: req.body.col,
      user_id: req.body.user_id,
    };

    try {
      const result = await createReservation(reservation); // NOTE: createFilm returns the new created object
      res.json(result);
    } catch (err) {
      res.status(503).json({
        error: `Database error during the creation of new reservation: ${err}`,
      });
    }
  }
);

// Route to retrieve the reservations, given an user id
router.get("/id/:id", [isLoggedIn, isAuthorized], async (req, res) => {
  try {
    const result = await getReservations(req.params.id);
    if (result.error) res.status(404).json(result);
    else res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// Route to retrieve the all reservations
router.get("/all", async (req, res) => {
  try {
    const result = await getAllReservations();
    if (result.error) res.status(404).json(result);
    else res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// Route to delete an existing reservation, given its “id”
// To Do: add a middleware to check if the user is the owner of the reservation
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const result = await deleteReservation(req.params.id);
    if (result == null) return res.status(200).json({});
    else return res.status(404).json(result);
  } catch (err) {
    res.status(503).json({
      error: `Database error during the deletion of reservation ${req.params.id}: ${err} `,
    });
  }
});

export { router };
