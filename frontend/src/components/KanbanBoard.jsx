import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";

const COLUMNS = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

export default function KanbanBoard({
  tasks,
  currentUser,
  isAdmin,
  onStatusChange,
  onEditTask,
}) {
  const getColumnTasks = (status) => tasks.filter((t) => t.status === status);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    // Find task to check permission before allowing move
    const task = tasks.find((t) => t._id === draggableId);
    if (!task) return;
    const isOwner = String(task.createdBy?._id) === String(currentUser?._id);
    const isAssigned =
      String(task.assignedTo?._id) === String(currentUser?._id);
    const canMove = isAdmin || isOwner || isAssigned;
    if (!canMove) return;

    onStatusChange(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            columnId={col.id}
            label={col.label}
            tasks={getColumnTasks(col.id)}
            currentUser={currentUser}
            isAdmin={isAdmin}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
