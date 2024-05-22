import express from "express";
import {
  submitAnswer,
  processAnswer,
  getAllAnswers,
  myCases,
  getAnswers,
  updatemycase,
  deletemycase,
  assignCaseToJudge,
  getJudges,
  getCasesAssignedToJudge,
  getJudge,
  attachStatement,
} from "../controllers/case.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Endpoint for user submission
router.post("/submit-answer", verifyToken, submitAnswer);

router.get("/getAllAnswers", verifyToken, getAllAnswers);
router.get("/getJudge", verifyToken, getJudge);

router.get("/getAnswers", verifyToken, getAnswers);
router.put("/updatemycase/:caseId/:userId", verifyToken, updatemycase);
router.delete("/deletemycase/:caseId/:userId", verifyToken, deletemycase);

router.get("/my-cases", verifyToken, myCases);
// Endpoint for admin approval/denial
router.put("/process-answer/:caseId", verifyToken, processAnswer);
router.put("/attach-statment/:caseId", attachStatement);

router.put("/assign-case", verifyToken, assignCaseToJudge);
router.get("/judges", verifyToken, getJudges);
router.get("/cases-assigned/:judgeId", verifyToken, getCasesAssignedToJudge);

export default router;
