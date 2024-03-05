import { Router } from "express";
import {
  getReservations,
  getAllReservations,
  deleteReservation,
  createReservation,
} from "../daos/dao-reservations.js";

const router = Router();

/*** Reservations APIs ***/

// Route to create a new reservation
router.post("/", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
