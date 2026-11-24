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
import Link from "next/link";
import CreateProjectDialog from "./createProject";

export default async function Projects() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const response = await api("/api/projects/list", {
    headers: token ? { Cookie: `token=${token}` } : {},
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Projects");
  }

  const projects: TProject[] = await response.json();

  return (
    <div className="container p-2">
      <CreateProjectDialog />
      <div className="flex flex-wrap justify-start items-start content-start gap-4 mt-4">
        {projects.map(({ id, name, description }) => (
          <Card key={id} size="sm" className="mx-auto w-full max-w-xs">
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>{description}</CardDescription>
              <CardAction>
                <Link href={`/projects/${id}`}>Add Tasks</Link>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
