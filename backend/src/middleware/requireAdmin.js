import { ENV } from "../lib/env.js";

export function requireAdmin(req, res, next) {
  if (!ENV.ADMIN_CLERK_ID) {
    return res.status(500).json({ message: "ADMIN_CLERK_ID is not configured" });
  }

  if (req.user?.clerkId !== ENV.ADMIN_CLERK_ID) {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}
