import ProjectMembers from "@/components/business/projectMembers";
import { TasksBoard } from "@/components/business/tasksBoard";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { IProjectDetails, TUser } from "@/types";
import { cookies } from "next/headers";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const detailsResponse = await api("/api/projects/details/" + projectId, {
    headers: token ? { Cookie: `token=${token}` } : {},
    cache: "no-store",
  });
  if (!detailsResponse.ok) {
    throw new Error("Failed to load project details");
  }
  const details: IProjectDetails = await detailsResponse.json();

  const usersResponse = await api("/api/users/list", {
    headers: token ? { Cookie: `token=${token}` } : {},
    cache: "no-store",
  });
  if (!usersResponse.ok) {
    throw new Error("Failed to load users list");
  }
  const list: TUser[] = await usersResponse.json();

  return (
    <div className="p-4">
      <TasksBoard
        initialTasks={details.tasks}
        projectId={projectId}
        members={details.users}
      />
      <Separator className="my-2" />
      <ProjectMembers
        members={details.users}
        projectId={projectId}
        users={list}
      />
    </div>
  );
}
