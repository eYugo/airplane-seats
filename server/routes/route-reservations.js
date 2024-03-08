import { Router } from "express";
import {
  getReservations,
  getAllReservations,
  deleteReservations,
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

// Route to create new reservations

router.post("/", async (req, res) => {
  const reservations = req.body;

  // Validate and create each reservation
  const results = [];
  for (let reservation of reservations) {
    // Validate reservation
    const errors = validationResult({
      ...reservation,
      airplane_type: check("airplane_type").isString(),
      row: check("row").isInt(),
      col: check("col").isString(),
      user_id: check("user_id").isInt(),
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await createReservation(reservation);
      results.push(result);
    } catch (err) {
      return res.status(503).json({
        error: `Database error during the creation of new reservation: ${err}`,
      });
    }
  }

  res.json(results);
});

// Route to retrieve the reservations, given an user id
router.get("/id/:id", async (req, res) => {
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
// To Do: multiple delete at once

router.delete("/delete", async (req, res) => {
  const reservationIds = req.body;

  try {
    await deleteReservations(reservationIds);
    res.json({ message: "Reservations deleted successfully" });
  } catch (err) {
    res.status(503).json({
      error: `Database error during the deletion of reservations: ${err}`,
    });
  }
});

export { router };
