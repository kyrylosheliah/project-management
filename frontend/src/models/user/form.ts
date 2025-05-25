import { z } from "zod";
import type { User } from "./type";

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type UserFormValues = z.infer<typeof UserSchema>;

export const getUserFormValues = (e: User) => {
  const temp: any = { ...e };
  delete temp.id;
  return temp as UserFormValues;
};
