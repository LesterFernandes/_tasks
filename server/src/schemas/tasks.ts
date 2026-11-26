import z from "zod";

export const ZStatusEnum = z.enum(["pending", "in_progress", "completed"]);

export const ZTask = z.object({
  name: z.string(),
  description: z.string().optional(),
  status: ZStatusEnum,
  projectId: z.uuid(),
  assignedTo: z.uuid().optional(),
});

export const ZTaskUpdate = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  status: ZStatusEnum,
  projectId: z.uuid(),
  assignedTo: z.uuid().optional(),
});

export type TaskStausEnum = z.infer<typeof ZStatusEnum>;
export type TTask = z.infer<typeof ZTask>;
export type TTaskUpdate = z.infer<typeof ZTaskUpdate>;
