import cors from "cors";
import express from "express";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import LocalStrategy from "passport-local";
import { router as usersRoutes } from "./routes/route-users.js";
import { router as reservationsRoutes } from "./routes/route-reservations.js";
import { verifyUser } from "./daos/dao-users.js";

const PORT = 3000;

const app = express();
app.use(morgan("combined"));
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method usersDao.getUser (i.e., id, username, name).
 **/
passport.use(
  new LocalStrategy(async function verify(username, password, callback) {
    const user = await verifyUser(username, password);
    if (!user) return callback(null, false, "Incorrect username or password");

    return callback(null, user);
  })
);

passport.serializeUser(function (user, callback) {
  callback(null, user);
});

passport.deserializeUser(function (user, callback) {
  return callback(null, user);
});

app.use(
  session({
    secret: "session-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));

app.use("/api/sessions", usersRoutes);

app.use("/api/reservations", reservationsRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
