import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ky from "ky";
import CreateUserDialog from "./createUser";
import { TUser } from "@/app/types";

export default async function Users() {
  const response = await ky("http://localhost:3020/api/users/list");

  if (!response.ok) {
    /// add toasts here
    throw new Error("Failed to fetch posts");
  }

  const users: TUser[] = await response.json();

  return (
    <div className="container">
      <CreateUserDialog />
      <Table>
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
              <TableCell className="text-right">00</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
