import { AuthResponse } from "@/types/user";
import { apiFetch } from "../apiFetch";

export async function updateUserSkill(skill: string) {
  const res = (await apiFetch("/auth/update", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: { skill },
  })) as AuthResponse;

  return res.user;
}

export async function removeUserSkill(skill: string) {
  const res = (await apiFetch("/auth/remove-skill", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: { skill },
  })) as AuthResponse;

  return res.user;
}
