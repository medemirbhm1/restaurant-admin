import { verifyToken } from "./token";

export const isAuthenticated = async (
  token: string | undefined
): Promise<boolean> => {
  if (!token) {
    return false;
  }
  const payload = await verifyToken(token);

  if (!payload) {
    return false;
  }
  return true;
};

export const isAdmin = async (token: string | undefined): Promise<boolean> => {
  if (!token) {
    return false;
  }
  const res = await verifyToken(token);

  if (!res) {
    return false;
  }
  console.log(token);
  console.log(res.payload);
  return res.payload.type === "admin" || res.payload.type === "superadmin";
};
