import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createSession,
  getAllSessionsAdmin,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
  deleteSession,
} from "../controllers/sessionController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.post("/", protectRoute, createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);
router.get("/admin/all", protectRoute, requireAdmin, getAllSessionsAdmin);

router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);
router.delete("/:id", protectRoute, deleteSession);

export default router;