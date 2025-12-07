import { AuthResponse } from "@/types/user";
import { apiFetch } from "../api";

export async function updateUserSkill(skill: string) {
  const res = (await apiFetch("/auth/update", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: { skill },
  })) as AuthResponse;

  return res.user;
}
