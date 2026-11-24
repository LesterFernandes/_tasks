import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { TProject } from "@/types";
import { cookies } from "next/headers";
import CreateProjectDialog from "./createProject";

export default async function Projects() {
  // const response = await ky("http://localhost:3020/api/projects/list", {
  //   headers: token ? { Cookie: `token=${token}` } : {},
  //   cache: "no-store",
  // });
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const response = await api("/api/projects/list", {
    headers: token ? { Cookie: `token=${token}` } : {},
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const projects: TProject[] = await response.json();

  return (
    <div className="flex flex-row">
      {projects.map(({ id, name, description }) => (
        <Card key={id} size="sm" className="mx-auto w-full max-w-xs">
          <CardHeader>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
            <CardAction>Card Action</CardAction>
          </CardHeader>
          {/* <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
      ))}
      <CreateProjectDialog />
    </div>
  );
}
