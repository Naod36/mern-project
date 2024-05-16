import express from "express";
import {
  submitAnswer,
  processAnswer,
  getAllAnswers,
  myCases,
  getAnswers,
} from "../controllers/case.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Endpoint for user submission
router.post("/submit-answer", verifyToken, submitAnswer);

router.get("/getAllAnswers", verifyToken, getAllAnswers);
router.get("/getAnswers", getAnswers);

router.get("/my-cases", verifyToken, myCases);
// Endpoint for admin approval/denial
router.put("/process-answer/:caseId", verifyToken, processAnswer);

export default router;
