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
import ky from "ky";
import { toast } from "@/components/ui/toast";

export default function CreateUserDialog() {
  const createUser = async (formData: FormData) => {
    const email = formData.get("email");
    const name = formData.get("name");

    const response = await ky.post("http://localhost:3020/api/users/create", {
      json: { email, name, role: "user" },
    });

    /// make these toasts work
    if (!response.ok) {
      toast.add({
        type: "error",
        description: "User could not be created.",
        priority: "high",
      });
    } else {
      toast.add({
        type: "success",
        description: "User has been created.",
      });
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">Create User</Button>}
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
            <form action={createUser}>
              <Input
                type="text"
                name="email"
                placeholder="Email"
                className="mb-2"
                required
              />
              <Input type="text" name="name" placeholder="Name" required />
              <Button type="submit">Create</Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
