import express from "express";
import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

// use middleware to get currentUser data from session
// requireAuth MW can only execute after currentUser MW
// If requireAuth MW is added, unless the user has signed in, we throw error
// router.get("/api/users/currentuser", currentUser, requireAuth, (req, res) => {
router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
