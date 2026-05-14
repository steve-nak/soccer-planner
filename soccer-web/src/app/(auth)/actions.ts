"use server";

import { redirect } from "next/navigation";
import { clearSession, createSession, loginUser, registerUser } from "@/lib/auth";

export type AuthActionState = {
  error?: string;
};

export async function loginAction(
  _state: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  try {
    const user = await loginUser({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    await createSession(user);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to sign in.",
    };
  }

  redirect("/dashboard");
}

export async function registerAction(
  _state: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const user = await registerUser({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password,
    });

    await createSession(user);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to create account.",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
