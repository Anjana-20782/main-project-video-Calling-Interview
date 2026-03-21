import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { createProblem, deleteProblem, getProblems, updateProblem } from "../controllers/problemController.js";

const router = express.Router();

router.get("/", getProblems);
router.post("/", protectRoute, requireAdmin, createProblem);
router.put("/:id", protectRoute, requireAdmin, updateProblem);
router.delete("/:id", protectRoute, requireAdmin, deleteProblem);

export default router;
