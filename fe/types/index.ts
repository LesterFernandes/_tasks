export type TUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export type TProject = {
  id: string;
  name: string;
  description: string;
};

export type TTask = {
  id: string;
  name: string;
  description?: string | null;
  status: "pending" | "in_progress" | "completed";
  projectId: string;
  createdBy: string;
  assignedTo?: string | undefined;
};

export interface IProjectDetails {
  users: {
    id: string;
    name: string;
    email: string;
    role: "user";
    joinedAt: Date;
  }[];

  tasks: {
    id: string;
    name: string;
    description: string | null;
    status: "pending" | "in_progress" | "completed";
    createdAt: Date;
    assignee: {
      id: string;
      name: string;
      email: string;
    } | null;
  }[];

  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}
