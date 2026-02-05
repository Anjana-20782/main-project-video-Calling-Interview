import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { fileURLToPath } from "url";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

const app = express();

/* -------------------------------------------
   Fix __dirname for ES modules
------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------------------------
   Middleware
------------------------------------------- */
app.use(express.json());

const allowedOrigins = [
  ENV.CLIENT_URL,
  ENV.PROD_URL,
];

app.use(
  cors({
    origin: allowedOrigins.filter(Boolean),
    credentials: true,
  })
);

/* -------------------------------------------
   API Routes
------------------------------------------- */
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api", (req, res) => {
  res.json({ message: "API working" });
});

/* -------------------------------------------
   Serve Frontend (PRODUCTION)
   dist folder is INSIDE backend/
------------------------------------------- */
if (ENV.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "dist");

  app.use(express.static(distPath));

  app.get("/", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

/* -------------------------------------------
   Start Server
------------------------------------------- */
connectDB()
  .then(() => {
    app.listen(ENV.PORT, () => {
      console.log(` Server running on port ${ENV.PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Database connection failed:", err);
  });