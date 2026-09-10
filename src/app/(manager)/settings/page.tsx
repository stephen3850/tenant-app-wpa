import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSubscription } from "@/actions/billing";
import { getOrganization } from "@/actions/org";
import { serialize } from "@/lib/utils";
import { SettingsView } from "./settings-view";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let subscription: any = null;
  let organization: any = null;

  try {
    const [subData, orgData] = await Promise.all([
      getSubscription(),
      getOrganization()
    ]);
    subscription = serialize(subData);
    organization = serialize(orgData);
  } catch (error) {
    console.error("Failed to fetch settings data:", error);
  }

  return <SettingsView subscription={subscription} organization={organization} />;
}
