import axios from "axios";
import { ENV } from "../lib/env.js";

const JUDGE0_BASE_URLS = [ENV.JUDGE0_API_URL, "https://ce.judge0.com", "https://judge0-ce.p.sulu.sh"].filter(
  Boolean
);

export async function executeCode(req, res) {
  try {
    const { language_id, source_code } = req.body;

    if (!language_id || !source_code) {
      return res.status(400).json({ message: "language_id and source_code are required" });
    }

    const headers = {
      "Content-Type": "application/json",
    };

    if (ENV.JUDGE0_API_KEY) {
      headers["X-RapidAPI-Key"] = ENV.JUDGE0_API_KEY;
    }

    if (ENV.JUDGE0_API_HOST) {
      headers["X-RapidAPI-Host"] = ENV.JUDGE0_API_HOST;
    }

    let lastError = null;

    for (const baseUrl of JUDGE0_BASE_URLS) {
      try {
        const { data } = await axios.post(
          `${baseUrl}/submissions?base64_encoded=false&wait=true`,
          {
            language_id,
            source_code,
          },
          { headers, timeout: 30000 }
        );

        return res.status(200).json(data);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("Unable to reach Judge0");
  } catch (error) {
    const status = error.response?.status && error.response.status < 500 ? error.response.status : 500;
    const details = error.response?.data || { message: error.message };
    return res.status(status).json({
      message: "Code execution request failed",
      details,
    });
  }
}
