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
import { readTokenClaims } from "@/lib/token";
import { ListCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@base-ui/react";

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

  const { role } = readTokenClaims(token!);

  return (
    <div className="container mx-auto p-2">
      {role == "admin" && <CreateProjectDialog />}
      <div className="flex w-full flex-wrap justify-start items-start gap-4 mt-4">
        {projects.map(({ id, name, description }) => (
          <Card key={id} size="sm" className="w-full max-w-xs">
            <CardHeader>
              <CardTitle className="truncate">{name}</CardTitle>
              <CardDescription className="truncate">
                {description}
              </CardDescription>
              <CardAction>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Link href={`/projects/${id}`}>
                        <ListCheck className="size-4" />
                      </Link>
                    }
                  />
                  <TooltipContent>
                    <p>manage tasks</p>
                  </TooltipContent>
                </Tooltip>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
