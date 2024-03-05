import { db } from "../db.js";

// Function to retrieve the reservations given the associated user id.
export const getReservations = (user) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM reservations WHERE  user_id=?";
    db.all(sql, [user], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const reservations = rows;
        resolve(reservations);
      }
    });
  });
};

// Function to retrieve the reservations given the associated user id.
export const getAllReservations = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM reservations";

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const reservations = rows;
        resolve(reservations);
      }
    });
  });
};

// Function to delete an existing reservation given its id.
export const deleteReservation = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM reservations WHERE id=?";
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
      }
      if (this.changes !== 1) resolve({ error: "No reservation deleted." });
      else resolve(null);
    });
  });
};

// Function to add new reservation in the database
export const createReservation = (reservation) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO reservations (airplane_type, row, col, user_id) VALUES(?, ?, ?, ?)";
    db.run(
      sql,
      [
        reservation.airplane_type,
        reservation.row,
        reservation.col,
        reservation.user_id,
      ],
      function (err) {
        if (err) {
          reject(err);
        }
        resolve(null);
      }
    );
  });
};
