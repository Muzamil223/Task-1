import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";
import TaskModal from "../components/TaskModal";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err.message);
    }
  }, [isAdmin]);

  useEffect(() => {
    Promise.all([fetchTasks(), fetchUsers()]).finally(() => setLoading(false));
  }, [fetchTasks, fetchUsers]);

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    const isOwner = String(task.createdBy?._id) === String(user?._id);
    const isAssigned = String(task.assignedTo?._id) === String(user?._id);
    const canView = isAdmin || isOwner || isAssigned;
    if (!canView) return;
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleTaskSave = async (formData) => {
    try {
      if (editingTask) {
        // If it's a status-only update (assigned user marking done), use PATCH
        if (formData._statusOnly) {
          const res = await api.patch(`/tasks/${editingTask._id}/status`, {
            status: formData.status,
          });
          setTasks((prev) =>
            prev.map((t) => (t._id === res.data._id ? res.data : t)),
          );
        } else {
          const res = await api.put(`/tasks/${editingTask._id}`, formData);
          setTasks((prev) =>
            prev.map((t) => (t._id === res.data._id ? res.data : t)),
          );
        }
      } else {
        const res = await api.post("/tasks", formData);
        setTasks((prev) => [res.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setModalOpen(false);
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
    } catch (err) {
      fetchTasks();
      console.error("Status update failed:", err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
        Loading board...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNewTask={openCreateModal} />

      <main className="px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading text-black">Task Board</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {tasks.length} total tasks
            </p>
            {!isAdmin && (
              <p className="text-xs text-gray-400 mt-0.5">
                You can create and manage your own tasks. Click a task you
                created or are assigned to.
              </p>
            )}
          </div>
          <button
            onClick={openCreateModal}
            className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            + New Task
          </button>
        </div>

        {isAdmin && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Tasks", value: tasks.length },
              { label: "Team Members", value: users.length },
              {
                label: "Completed",
                value: tasks.filter((t) => t.status === "done").length,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-gray-200 rounded-xl px-4 py-3"
              >
                <p className="text-xl font-semibold text-black">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <KanbanBoard
          tasks={tasks}
          currentUser={user}
          isAdmin={isAdmin}
          onStatusChange={handleStatusChange}
          onEditTask={openEditModal}
        />
      </main>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          users={users}
          isAdmin={isAdmin}
          currentUser={user}
          onSave={handleTaskSave}
          onDelete={handleTaskDelete}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
