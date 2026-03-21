import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, default: "" },
    output: { type: String, default: "" },
    explanation: { type: String, default: "" },
  },
  { _id: false }
);

const descriptionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    notes: { type: [String], default: [] },
  },
  { _id: false }
);

const languageContentSchema = new mongoose.Schema(
  {
    javascript: { type: String, default: "" },
    python: { type: String, default: "" },
    java: { type: String, default: "" },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, unique: true, trim: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    category: { type: String, default: "" },
    description: { type: descriptionSchema, required: true },
    examples: { type: [exampleSchema], default: [] },
    constraints: { type: [String], default: [] },
    starterCode: { type: languageContentSchema, default: () => ({}) },
    expectedOutput: { type: languageContentSchema, default: () => ({}) },
    createdByClerkId: { type: String, required: true },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
