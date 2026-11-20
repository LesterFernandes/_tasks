import z from "zod";

export const ZUser = z.object({
  name: z.string(),
  email: z.string(),
  role: z.enum(["admin", "user"]),
});

export type TUser = z.infer<typeof ZUser>;
