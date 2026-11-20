import z from "zod";

export const ZProject = z.object({
  name: z.string(),
  description: z.string(),
  createdBy: z.uuid(),
});

export type TProject = z.infer<typeof ZProject>;
