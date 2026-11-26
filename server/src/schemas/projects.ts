import z from "zod";

export const ZProject = z.object({
  name: z.string(),
  description: z.string(),
  createdBy: z.uuid().optional(),
});

export type TProject = z.infer<typeof ZProject>;
