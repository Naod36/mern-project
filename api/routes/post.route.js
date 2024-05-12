import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  deletecasetemplate,
  getcasetemplates,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);

router.get("/getcasetemplates", getcasetemplates);
router.delete(
  "/deletecasetemplate/:caseId/:userId",
  verifyToken,
  deletecasetemplate
);

export default router;
