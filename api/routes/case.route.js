import express from "express";
import {
  submitAnswer,
  processAnswer,
  getAllAnswers,
} from "../controllers/case.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Endpoint for user submission
router.post("/submit-answer", verifyToken, submitAnswer);

router.get("/getAllAnswers", verifyToken, getAllAnswers);

// Endpoint for admin approval/denial
router.post("/process-answer", verifyToken, processAnswer);

export default router;
