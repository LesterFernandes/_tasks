"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IProjectDetails } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CreateTask from "./createTask";
import UpdateTask from "./updateTask";

const ITEM_TYPE = "TASK";

type DragItem = { id: string; index: number };
type TaskCardProps = {
  task: IProjectDetails["tasks"][number];
  members: IProjectDetails["users"];
  projectId: string;
  index: number;
  moveTask: (from: number, to: number) => void;
  onDragEnd: () => void;
};
type TaskBoardProps = {
  initialTasks: IProjectDetails["tasks"];
  projectId: string;
  members: IProjectDetails["users"];
  onReorder?: (orderedIds: string[]) => void;
};

function TaskCard({
  task,
  members,
  index,
  projectId,
  moveTask,
  onDragEnd,
}: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem>({
    accept: ITEM_TYPE,
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const pointer = monitor.getClientOffset();
      if (!pointer) return;

      // Horizontal midpoint check. Cards flow in a row, not a column.
      const rect = ref.current.getBoundingClientRect();
      const midX = rect.width / 2;
      const hoverX = pointer.x - rect.left;

      // Only swap once the pointer crosses the midpoint
      if (dragIndex < hoverIndex && hoverX < midX) return;
      if (dragIndex > hoverIndex && hoverX > midX) return;

      moveTask(dragIndex, hoverIndex);
      // keep the dragged item's index in sync
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: (): DragItem => ({ id: task.id, index }),
    end: onDragEnd,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  // eslint-disable-next-line react-hooks/refs
  drag(drop(ref));

  return (
    <div ref={ref} className={cn("w-40", isDragging && "opacity-40")}>
      <Card className="cursor-grab active:cursor-grabbing">
        <CardHeader>
          <CardTitle className="truncate text-base">{task.name}</CardTitle>
          <CardAction>
            <UpdateTask task={task} members={members} projectId={projectId} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex flex-row gap-2">
          <Badge variant={"secondary"}>{task.status}</Badge>
          <Badge variant={"secondary"}>{task.assignee?.name}</Badge>
        </CardFooter>
      </Card>
    </div>
  );
}

export function TasksBoard({
  initialTasks,
  projectId,
  members,
  onReorder,
}: TaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);

  // Re-sync when the API data changes
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setTasks(initialTasks), [initialTasks]);

  // Latest order for the drag-end callback
  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const moveTask = useCallback((from: number, to: number) => {
    setTasks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    onReorder?.(tasksRef.current.map((t) => t.id));
  }, [onReorder]);

  return (
    <>
      <div className="mb-3">
        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-wrap gap-4">
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                members={members}
                projectId={projectId}
                index={index}
                moveTask={moveTask}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </DndProvider>
      </div>
      <CreateTask projectId={projectId} members={members} />
    </>
  );
}
