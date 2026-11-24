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
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateProjectDialog() {
  const router = useRouter();
  const createProject = async (formData: FormData) => {
    const desc = formData.get("desc");
    const name = formData.get("name");
    const response = await api.post("/api/projects/create", {
      json: {
        description: desc,
        name,
      },
    });

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
      router.refresh();
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger
          render={<Button variant="default">Create Project</Button>}
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
            <form action={createProject}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Project name"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Textarea
                    id="textarea-desc"
                    placeholder="Type a project description here..."
                    name="desc"
                  />
                </div>
                <div className="grid gap-2">
                  <Button type="submit">Create</Button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
