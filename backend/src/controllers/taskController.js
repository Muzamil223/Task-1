const Task = require("../models/Task");

// Helper: Check if user is Admin or the Creator
const isOwnerOrAdmin = (task, user) =>
  user.role === "admin" || String(task.createdBy) === String(user.id);

// Helper: Check if user is the one assigned to the task
const isAssignedUser = (task, user) =>
  task.assignedTo && String(task.assignedTo) === String(user.id);

// GET /api/tasks
const getTasks = async (req, res) => {
  try {
    let query;
    if (req.user.role === "admin") {
      query = Task.find();
    } else {
      query = Task.find({
        $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }],
      });
    }

    const tasks = await query
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tasks/:id
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } =
      req.body;

    const resolvedAssignee =
      req.user.role === "admin" ? assignedTo || null : req.user.id;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      assignedTo: resolvedAssignee,
      createdBy: req.user.id,
    });

    const populated = await task.populate([
      { path: "assignedTo", select: "name email" },
      { path: "createdBy", select: "name email" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const existing = await Task.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Task not found" });

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      _statusOnly,
    } = req.body;

    // Check if user is assigned to this task
    const isAssigned = isAssignedUser(existing, req.user);

    // If user is assigned and only updating status, allow it immediately
    if (_statusOnly && isAssigned) {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true },
      )
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");
      return res.json(task);
    }

    // Otherwise, check for Owner or Admin permissions
    if (!isOwnerOrAdmin(existing, req.user)) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this task" });
    }

    // Only admins can change the assignee of a task
    const resolvedAssignee =
      req.user.role === "admin" ? assignedTo : existing.assignedTo;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
        priority,
        dueDate: dueDate || null,
        assignedTo: resolvedAssignee,
      },
      { new: true, runValidators: true },
    )
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/tasks/:id/status — For Drag and Drop
const moveTask = async (req, res) => {
  try {
    const existing = await Task.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Task not found" });

    // Allow if Admin, Creator, OR Assigned User
    const canMove =
      isOwnerOrAdmin(existing, req.user) || isAssignedUser(existing, req.user);

    if (!canMove) {
      return res
        .status(403)
        .json({ message: "Not authorized to move this task" });
    }

    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    )
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const existing = await Task.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Task not found" });

    if (!isOwnerOrAdmin(existing, req.user)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
};
