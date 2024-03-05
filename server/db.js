import sqlite from "sqlite3";

// open the database
const db = new sqlite.Database("airplanes.sqlite", (err) => {
  if (err) throw err;
});

export { db };
