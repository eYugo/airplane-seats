import { db } from "../db.js";
import crypto from "crypto";

// Function to return user's information given its id.
export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id=?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: "User not found." });
      else {
        // By default, the local strategy looks for "username":
        // for simplicity, instead of using "email", we create an object with that property.
        const user = { id: row.id, username: row.email, name: row.name };
        resolve(user);
      }
    });
  });
};

// Function to use at log-in time to verify username and password.
export const verifyUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email=?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = { id: row.id, username: row.email, name: row.name };
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          if (
            !crypto.timingSafeEqual(
              Buffer.from(row.password, "hex"),
              hashedPassword
            )
          )
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};

// Function to create a user
export const createUser = (user) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Users (email, name, password, salt) VALUES (?, ?, ?, ?)";
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(user.password, salt, 32, function (err, hashedPassword) {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (!hashedPassword) reject("Error hashing password");
      db.run(
        sql,
        [user.email, user.name, hashedPassword.toString("hex"), salt],
        function (err) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            const returnedUser = {
              email: user.email,
              name: user.name,
              password: hashedPassword.toString("hex"),
              salt: salt,
            };
            resolve(returnedUser);
          }
        }
      );
    });
  });
};
