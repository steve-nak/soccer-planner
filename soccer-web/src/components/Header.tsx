import { logoutAction } from "@/app/(auth)/actions";
import { getCurrentUser } from "@/lib/auth";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const user = await getCurrentUser();

  return <HeaderClient logoutAction={logoutAction} user={user} />;
}
