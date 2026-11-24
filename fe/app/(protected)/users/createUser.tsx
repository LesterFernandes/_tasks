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
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateUserDialog() {
  const router = useRouter();

  const createUser = async (formData: FormData) => {
    const email = formData.get("email");
    const name = formData.get("name");
    const pw = formData.get("pw");

    const response = await api.post("/api/users/create", {
      json: { email, name, role: "user", password: pw },
    });

    ///Duplicate user error message
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
      router.refresh();
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger
          render={<Button variant="default">Create User</Button>}
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
            <form action={createUser}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    name="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pw">Password</Label>
                  <Input
                    id="pw"
                    type="text"
                    name="pw"
                    placeholder="Password"
                    required
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
