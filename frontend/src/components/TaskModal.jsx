import { useState, useEffect } from "react";

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const toDateInputValue = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
};

export default function TaskModal({
  task,
  users,
  isAdmin,
  currentUser,
  onSave,
  onDelete,
  onClose,
}) {
  const isEditing = Boolean(task);
  const isOwner = String(task?.createdBy?._id) === String(currentUser?._id);
  const isAssigned = String(task?.assignedTo?._id) === String(currentUser?._id);
  const canFullyEdit = isAdmin || isOwner;
  // Assigned users who aren't owner/admin can only update status
  const statusOnly = isEditing && isAssigned && !canFullyEdit;

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: toDateInputValue(task.dueDate),
        assignedTo: task.assignedTo?._id || "",
      });
    }
  }, [task]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!statusOnly && !form.title.trim()) {
      return setError("Title is required");
    }

    setError("");
    setSaving(true);
    try {
      if (statusOnly) {
        await onSave({ status: form.status, _statusOnly: true });
      } else {
        await onSave({
          ...form,
          dueDate: form.dueDate || null,
          assignedTo: form.assignedTo || null,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkDone = async () => {
    setError("");
    setSaving(true);
    try {
      await onSave({ status: "done", _statusOnly: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark as done");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setDeleting(true);
    await onDelete(task._id);
    setDeleting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-heading text-black">
            {isEditing ? (statusOnly ? "View Task" : "Edit Task") : "New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-xl leading-none"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {/* Banner for assigned-only users */}
        {statusOnly && (
          <div className="mb-4 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            You are assigned to this task. You can update its status or mark it as done.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title {!statusOnly && "*"}
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required={!statusOnly}
              placeholder="Task title"
              disabled={!canFullyEdit}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none
                ${
                  !canFullyEdit
                    ? "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                    : "border-gray-300 focus:border-black"
                }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Optional description..."
              disabled={!canFullyEdit}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none resize-none
                ${
                  !canFullyEdit
                    ? "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                    : "border-gray-300 focus:border-black"
                }`}
            />
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                disabled={!canFullyEdit}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none capitalize
                  ${
                    !canFullyEdit
                      ? "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                      : "border-gray-300 focus:border-black"
                  }`}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p} className="capitalize">
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date + Assign row */}
          <div className={`grid gap-3 ${isAdmin ? "grid-cols-2" : "grid-cols-1"}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                disabled={!canFullyEdit}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none
                  ${
                    !canFullyEdit
                      ? "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                      : "border-gray-300 focus:border-black"
                  }`}
              />
            </div>
            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To
                </label>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {!isAdmin && isEditing && task.assignedTo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <div className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-700">
                  {task.assignedTo.name}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {isEditing && canFullyEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm text-red-500 border border-red-200 rounded-lg px-4 py-2 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            ) : (
              <span />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-gray-600 border border-gray-200 rounded-lg px-4 py-2"
              >
                Cancel
              </button>

              {/* Mark as Done button — shown to assigned users when task isn't done yet */}
              {statusOnly && form.status !== "done" && (
                <button
                  type="button"
                  onClick={handleMarkDone}
                  disabled={saving}
                  className="text-sm bg-green-600 text-white rounded-lg px-5 py-2 disabled:opacity-50 hover:bg-green-700"
                >
                  {saving ? "Saving..." : "✓ Mark as Done"}
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="text-sm bg-black text-white rounded-lg px-5 py-2 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : statusOnly
                  ? "Update Status"
                  : isEditing
                  ? "Update"
                  : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}