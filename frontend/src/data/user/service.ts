import { emitHttp } from "../../utils/http";

export const fetchUsers = async () => {
  const res = await emitHttp("GET", "/user/all");
  if (!res.ok) throw new Error("Failed to load users");
  return res.json();
};
