import Problem from "../models/Problem.js";

export async function getProblems(_, res) {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    return res.status(200).json({ problems });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch problems" });
  }
}

export async function createProblem(req, res) {
  try {
    const payload = req.body;
    const createdByClerkId = req.user.clerkId;

    if (!payload?.id || !payload?.title || !payload?.difficulty || !payload?.description?.text) {
      return res.status(400).json({ message: "id, title, difficulty and description.text are required" });
    }

    const exists = await Problem.findOne({ $or: [{ id: payload.id }, { title: payload.title }] });
    if (exists) {
      return res.status(409).json({ message: "Problem id or title already exists" });
    }

    const problem = await Problem.create({
      ...payload,
      createdByClerkId,
    });

    return res.status(201).json({ problem });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create problem" });
  }
}

export async function updateProblem(req, res) {
  try {
    const { id } = req.params;
    const updated = await Problem.findOneAndUpdate({ id }, req.body, { new: true, runValidators: true });

    if (!updated) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res.status(200).json({ problem: updated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update problem" });
  }
}

export async function deleteProblem(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Problem.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete problem" });
  }
}
