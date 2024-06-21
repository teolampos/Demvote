import { z } from "zod";

export const User = z.object({
  firstname: z.string(),
  lastname: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  dateOfBirth: z.string().date(),
  gender: z.string(),
});

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type User = z.infer<typeof User>;

export enum ButtonTypeEnum {
  LOGIN = "Login",
  SIGN_UP = "Sign up",
}
