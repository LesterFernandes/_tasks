import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/toast";
import { IProjectDetails, TUser } from "@/types";
import { useState } from "react";

interface Props {
  projectId: string;
  members: IProjectDetails["users"];
}

export const status_options = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export default function CreateTask({ projectId, members }: Props) {
  const router = useRouter();
  const [newMember, setNewMember] = useState<TUser | null>(null);

  const submit = async (formData: FormData) => {
    const body = {
      name: formData.get("name"),
      description: formData.get("desc"),
      status: formData.get("status") || "pending",
      projectId,
      assignedTo: newMember?.id,
    };

    const response = await api.post("/api/tasks/create", {
      json: body,
    });

    setNewMember(null);
    if (!response.ok) {
      toast.add({
        type: "error",
        description: "Task could not be created.",
        priority: "high",
      });
    } else {
      toast.add({
        type: "success",
        description: "Task created.",
      });
      router.refresh();
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="default">Create Task</Button>} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <form action={submit}>
          <div className="flex flex-col gap-4 mb-3">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="desc" />
            </div>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" id="status" items={status_options}>
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
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
