// Trigger routing refresh
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    const roleNames = (session.user as any).roles || [];

    if (roleNames.includes("PLATFORM_ADMIN")) {
      redirect("/admin/dashboard");
    }

    if (roleNames.includes("LANDLORD")) {
      redirect("/landlord/dashboard");
    }

    if (roleNames.includes("TENANT")) {
      redirect("/portal");
    }

    // Default for Manager / Staff
    redirect("/dashboard");
  }

  redirect("/login");
}
