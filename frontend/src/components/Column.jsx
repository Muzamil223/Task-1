import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function Column({
  columnId,
  label,
  tasks,
  currentUser,
  isAdmin,
  onEditTask,
}) {
  const borderColor =
    columnId === "todo"
      ? "border-t-gray-400"
      : columnId === "in-progress"
        ? "border-t-yellow-400"
        : "border-t-green-400";

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 border-t-4 shadow-sm flex flex-col ${borderColor}`}
    >
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
        <span className="text-xs bg-gray-100 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 space-y-2 min-h-[200px] transition-colors ${
              snapshot.isDraggingOver ? "bg-gray-50" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                currentUser={currentUser}
                isAdmin={isAdmin}
                onEdit={() => onEditTask(task)}
              />
            ))}
            {provided.placeholder}

            {!tasks.length && !snapshot.isDraggingOver && (
              <p className="text-xs text-gray-400 text-center pt-8">
                No tasks here
              </p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
