import { Draggable } from "@hello-pangea/dnd";

const PRIORITY_STYLES = {
  high: "bg-red-50 text-red-600 border-red-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  low: "bg-green-50 text-green-700 border-green-200",
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
};

export default function TaskCard({
  task,
  index,
  currentUser,
  isAdmin,
  onEdit,
}) {
  const overdue = task.status !== "done" && isOverdue(task.dueDate);
  const isOwner = String(task.createdBy?._id) === String(currentUser?._id);
  const isAssigned = String(task.assignedTo?._id) === String(currentUser?._id);
  const canEdit = isAdmin || isOwner;
  const canView = isAdmin || isOwner || isAssigned; // Allow viewing assigned tasks too

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={canView ? onEdit : undefined}
          className={`bg-white border rounded-lg p-3 select-none
            ${snapshot.isDragging ? "shadow-lg border-gray-400" : "border-gray-200"}
            ${canView ? "cursor-pointer hover:border-gray-300" : "cursor-default opacity-90"}
          `}
        >
          {/* Top row: priority + owner badge */}
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded border capitalize ${PRIORITY_STYLES[task.priority]}`}
            >
              {task.priority}
            </span>
            {isOwner && (
              <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                yours
              </span>
            )}
          </div>

          {/* Title */}
          <p className="text-sm font-medium text-black leading-snug mb-1">
            {task.title}
          </p>

          {/* Description preview */}
          {task.description && (
            <p className="text-xs text-gray-400 line-clamp-2 mb-2">
              {task.description}
            </p>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between mt-2">
            {task.assignedTo ? (
              <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 truncate max-w-[110px]">
                {task.assignedTo.name}
              </span>
            ) : (
              <span className="text-xs text-gray-300">Unassigned</span>
            )}

            {task.dueDate && (
              <span
                className={`text-xs ${overdue ? "text-red-500 font-medium" : "text-gray-400"}`}
              >
                {overdue ? "⚠ " : ""}
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
