import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { IProjectDetails, TUser } from "@/types";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "../ui/toast";
import { status_options } from "./createTask";

interface Props {
  task: IProjectDetails["tasks"][number];
  members: IProjectDetails["users"];
  projectId: string;
}

export default function UpdateTask({ task, members, projectId }: Props) {
  const router = useRouter();
  const [newMember, setNewMember] = useState<TUser | null>(null);
  const [status, setStatus] = useState(null);

  const updateTask = async () => {
    const body = {
      id: task.id,
      name: task.name,
      description: task.description,
      projectId,
      status,
      assignedTo: newMember?.id,
    };

    const response = await api.post("/api/tasks/update", {
      json: body,
    });

    setNewMember(null);
    if (!response.ok) {
      toast.add({
        type: "error",
        description: "Task could not be updated.",
        priority: "high",
      });
    } else {
      toast.add({
        type: "success",
        description: "Task updated.",
      });
      router.refresh();
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon-xs">
            <SquarePen className="size-3" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mb-3">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              items={status_options}
              onValueChange={setStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="New member email" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {status_options.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid flex-1 gap-2">
            <Label htmlFor="members">Project Members</Label>
            <Select
              id="members"
              value={newMember?.email || ""}
              onValueChange={setNewMember}
            >
              <SelectTrigger>
                <SelectValue placeholder="New member email" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" onClick={() => updateTask()}>
            update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
