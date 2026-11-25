import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { TUser } from "@/types";
import { cookies } from "next/headers";
import CreateUserDialog from "./createUser";

export default async function Users() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const response = await api("/api/users/list", {
    headers: token ? { Cookie: `token=${token}` } : {},
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Users");
  }

  const users: TUser[] = await response.json();

  ///implement user deelte
  return (
    <div className="container p-2">
      <CreateUserDialog />
      <Table className="mt-4 max-w-lg w-full">
        <TableCaption>Users List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(({ name, email, id }) => (
            <TableRow key={id}>
              <TableCell className="font-medium">{name}</TableCell>
              <TableCell>{email}</TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
