import { apiFetch, withAuth } from "@/lib/api-client";
import type { ApiResponse, User } from "@/services/types";

const getProfile = async (): Promise<User> => {
  const response = await apiFetch<User>("/user", {
    method: "GET",
    ...withAuth(),
  });
  return response;
};

const resendVerification = async (email: string) =>
  apiFetch<ApiResponse<unknown>>("/email/resend", {
    method: "POST",
    body: { email },
  });

export const UserService = {
  getProfile,
  resendVerification,
};

export type UserServiceType = typeof UserService;
