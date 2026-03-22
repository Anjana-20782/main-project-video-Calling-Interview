import { useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { isAdminUser } from "../lib/admin";
import { useAllSessionsAdmin, useDeleteSession } from "../hooks/useSessions";
import { useCreateProblem, useDeleteProblem, useProblems, useUpdateProblem } from "../hooks/useProblems";

const initialForm = {
  id: "",
  title: "",
  difficulty: "Easy",
  category: "",
  descriptionText: "",
  notes: "",
  constraints: "",
  examplesJson: "[]",
  jsStarter: "",
  pyStarter: "",
  javaStarter: "",
  jsExpected: "",
  pyExpected: "",
  javaExpected: "",
};

function parseLines(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Safe parse for Examples JSON — invalid JSON was failing silently before. */
function parseExamplesJson(raw) {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      throw new Error("Examples must be a JSON array");
    }
    return parsed.map((ex) => ({
      input: ex?.input != null ? String(ex.input) : "",
      output: ex?.output != null ? String(ex.output) : "",
      explanation: ex?.explanation != null ? String(ex.explanation) : "",
    }));
  } catch (e) {
    if (e?.message === "Examples must be a JSON array") throw e;
    throw new Error("Examples must be valid JSON. Use [] if you have no examples.");
  }
}

function mapProblemToForm(problem) {
  return {
    id: problem.id || "",
    title: problem.title || "",
    difficulty: problem.difficulty || "Easy",
    category: problem.category || "",
    descriptionText: problem.description?.text || "",
    notes: (problem.description?.notes || []).join("\n"),
    constraints: (problem.constraints || []).join("\n"),
    examplesJson: JSON.stringify(problem.examples || [], null, 2),
    jsStarter: problem.starterCode?.javascript || "",
    pyStarter: problem.starterCode?.python || "",
    javaStarter: problem.starterCode?.java || "",
    jsExpected: problem.expectedOutput?.javascript || "",
    pyExpected: problem.expectedOutput?.python || "",
    javaExpected: problem.expectedOutput?.java || "",
  };
}

function AdminPage() {
  const { user } = useUser();
  const admin = isAdminUser(user);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const { apiProblems, isLoading: loadingProblems } = useProblems();
  const { data: sessionsData, isLoading: loadingSessions } = useAllSessionsAdmin();
  const createProblem = useCreateProblem();
  const updateProblem = useUpdateProblem();
  const deleteProblem = useDeleteProblem();
  const deleteSession = useDeleteSession();

  const sessions = sessionsData?.sessions || [];
  const sortedProblems = useMemo(
    () => [...(apiProblems || [])].sort((a, b) => a.title.localeCompare(b.title)),
    [apiProblems]
  );

  if (!admin) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="alert alert-error">Only admin can access this panel.</div>
        </div>
      </div>
    );
  }

  const buildPayload = () => {
    const examples = parseExamplesJson(form.examplesJson);
    return {
      id: form.id.trim(),
      title: form.title.trim(),
      difficulty: form.difficulty,
      category: form.category.trim(),
      description: {
        text: form.descriptionText.trim(),
        notes: parseLines(form.notes),
      },
      examples,
      constraints: parseLines(form.constraints),
      starterCode: {
        javascript: form.jsStarter,
        python: form.pyStarter,
        java: form.javaStarter,
      },
      expectedOutput: {
        javascript: form.jsExpected,
        python: form.pyExpected,
        java: form.javaExpected,
      },
    };
  };

  const onSaveProblem = async () => {
    try {
      if (!form.id.trim() || !form.title.trim() || !form.descriptionText.trim()) {
        toast.error("Please fill Problem ID, Title, and Description.");
        return;
      }

      const payload = buildPayload();

      if (editingId) {
        await updateProblem.mutateAsync({ id: editingId, payload });
      } else {
        await createProblem.mutateAsync(payload);
      }
      setEditingId(null);
      setForm(initialForm);
    } catch (err) {
      // API errors are toasts from mutation onError; JSON/validation errors land here
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Could not save problem.";
      if (!err?.response) {
        toast.error(msg);
      }
    }
  };

  const onEditProblem = (problem) => {
    setEditingId(problem.id);
    setForm(mapProblemToForm(problem));
  };

  const onSubmitProblemForm = (e) => {
    e.preventDefault();
    onSaveProblem();
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>

        <div className="card bg-base-100 border border-base-300">
          <form className="card-body space-y-6" onSubmit={onSubmitProblemForm}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">{editingId ? "Edit Problem Form" : "Add Problem Form"}</h2>
              <span className="badge badge-outline">Admin only</span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Problem ID</span>
                <input
                  className="input input-bordered w-full"
                  placeholder="two-sum"
                  value={form.id}
                  onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
                  required
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Title</span>
                <input
                  className="input input-bordered w-full"
                  placeholder="Two Sum"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Difficulty</span>
                <select
                  className="select select-bordered w-full"
                  value={form.difficulty}
                  onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </label>
            </div>

            <label className="form-control w-full">
              <span className="label-text mb-1 font-medium">Category</span>
              <input
                className="input input-bordered w-full"
                placeholder="Array • Hash Table"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1 font-medium">Description</span>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Describe the problem..."
                value={form.descriptionText}
                onChange={(e) => setForm((p) => ({ ...p, descriptionText: e.target.value }))}
                required
              />
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Notes (one per line)</span>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Constraints (one per line)</span>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={form.constraints}
                  onChange={(e) => setForm((p) => ({ ...p, constraints: e.target.value }))}
                />
              </label>
            </div>

            <label className="form-control w-full">
              <span className="label-text mb-1 font-medium">Examples (JSON)</span>
              <textarea
                className="textarea textarea-bordered h-28 font-mono text-xs"
                placeholder='[{"input":"","output":"","explanation":""}]'
                value={form.examplesJson}
                onChange={(e) => setForm((p) => ({ ...p, examplesJson: e.target.value }))}
              />
            </label>

            <div className="grid md:grid-cols-3 gap-4">
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">JavaScript starter</span>
                <textarea
                  className="textarea textarea-bordered h-32 font-mono text-xs"
                  value={form.jsStarter}
                  onChange={(e) => setForm((p) => ({ ...p, jsStarter: e.target.value }))}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Python starter</span>
                <textarea
                  className="textarea textarea-bordered h-32 font-mono text-xs"
                  value={form.pyStarter}
                  onChange={(e) => setForm((p) => ({ ...p, pyStarter: e.target.value }))}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Java starter</span>
                <textarea
                  className="textarea textarea-bordered h-32 font-mono text-xs"
                  value={form.javaStarter}
                  onChange={(e) => setForm((p) => ({ ...p, javaStarter: e.target.value }))}
                />
              </label>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">JavaScript expected output</span>
                <textarea
                  className="textarea textarea-bordered h-24 font-mono text-xs"
                  value={form.jsExpected}
                  onChange={(e) => setForm((p) => ({ ...p, jsExpected: e.target.value }))}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Python expected output</span>
                <textarea
                  className="textarea textarea-bordered h-24 font-mono text-xs"
                  value={form.pyExpected}
                  onChange={(e) => setForm((p) => ({ ...p, pyExpected: e.target.value }))}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Java expected output</span>
                <textarea
                  className="textarea textarea-bordered h-24 font-mono text-xs"
                  value={form.javaExpected}
                  onChange={(e) => setForm((p) => ({ ...p, javaExpected: e.target.value }))}
                />
              </label>
            </div>

            <div className="flex gap-2">
              <button className="btn btn-primary" type="submit" disabled={createProblem.isPending || updateProblem.isPending}>
                {editingId ? "Update Problem" : "Add Problem"}
              </button>
              {editingId && (
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h2 className="text-xl font-semibold mb-3">All Problems</h2>
            {loadingProblems ? (
              <p>Loading problems...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Difficulty</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProblems.map((problem) => (
                      <tr key={problem.id}>
                        <td>{problem.id}</td>
                        <td>{problem.title}</td>
                        <td>{problem.difficulty}</td>
                        <td className="space-x-2">
                          <button className="btn btn-xs" onClick={() => onEditProblem(problem)}>
                            Edit
                          </button>
                          <button
                            className="btn btn-xs btn-error btn-outline"
                            onClick={() => {
                              if (window.confirm(`Delete ${problem.title}?`)) {
                                deleteProblem.mutate(problem.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h2 className="text-xl font-semibold mb-3">Sessions (Admin delete only)</h2>
            {loadingSessions ? (
              <p>Loading sessions...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Problem</th>
                      <th>Host</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session._id}>
                        <td>{session.problem}</td>
                        <td>{session.host?.name}</td>
                        <td>{session.status}</td>
                        <td>
                          <button
                            className="btn btn-xs btn-error btn-outline"
                            onClick={() => {
                              if (window.confirm("Delete this session?")) deleteSession.mutate(session._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
