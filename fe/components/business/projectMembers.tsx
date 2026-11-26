"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { IProjectDetails, TUser } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";

interface Props {
  members: IProjectDetails["users"];
  projectId: string;
}

export default function ProjectMembers(props: Props) {
  const router = useRouter();
  const [newMember, setNewMember] = useState<TUser | null>(null);
  const [users, setUsers] = useState<TUser[]>([]);

  useEffect(() => {
    async function getUsersList() {
      const usersResponse = await api("/api/users/list");
      if (!usersResponse.ok) {
        throw new Error("Failed to load users list");
      }
      const list: TUser[] = await usersResponse.json();
      setUsers(list);
    }
    getUsersList();
  }, []);

  const addNewProjectMember = async () => {
    const res = await api.post("/api/projects/create-member", {
      json: {
        projectId: props.projectId,
        userId: newMember!.id,
      },
    });

    if (!res.ok) {
      toast.add({
        type: "error",
        description: "Member could not be created.",
        priority: "high",
      });
    } else {
      toast.add({
        type: "success",
        description: "Member successfully created.",
      });

      router.refresh();
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">View Members</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Members</DialogTitle>
          <DialogDescription>
            List of users assigned to project
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-3">
          <Table>
            <TableBody>
              {props.members.map(({ name, id, email }) => (
                <TableRow key={id}>
                  <TableCell>
                    <span className="text-sm text-foreground">{name}</span>
                    <span className="ml-2 text-muted-foreground">{email}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter className="sm:justify-start">
          {/*@ts-expect-error - ignoring type mismatch */}
          <Select value={newMember?.email || ""} onValueChange={setNewMember}>
            <SelectTrigger className="w-70">
              <SelectValue placeholder="New member email" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {users.map(({ email, id }) => (
                  <SelectItem key={id} value={{ email, id }}>
                    {email}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={addNewProjectMember}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
