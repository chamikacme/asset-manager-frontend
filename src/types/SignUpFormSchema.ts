import { z } from "zod";

export const signUpformSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});
