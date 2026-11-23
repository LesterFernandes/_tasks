"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import ky from "ky";

export default function CreateProjectDialog() {
  const createProject = async (formData: FormData) => {
    const desc = formData.get("desc");
    const name = formData.get("name");

    /// add rbac supposrt
    const response = await ky.post(
      "http://localhost:3020/api/projects/create",
      {
        json: {
          description: desc,
          name,
          createdBy: "a8e2f30e-d92d-40fa-813c-c69d44cd4b34",
        },
      },
    );

    /// make these toasts work
    if (!response.ok) {
      toast.add({
        type: "error",
        description: "Project could not be created.",
        priority: "high",
      });
    } else {
      toast.add({
        type: "success",
        description: "Project has been created.",
      });
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">Create Project</Button>}
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
            <form action={createProject}>
              <Input type="text" name="name" placeholder="Name" required />
              <Textarea
                id="textarea-desc"
                placeholder="Type a project description here..."
                name="desc"
              />
              <Button type="submit">Create</Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
