import { redirect } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Register - Soccer Planner",
  description: "Create a new Soccer Planner account",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <RegisterForm />;
}
