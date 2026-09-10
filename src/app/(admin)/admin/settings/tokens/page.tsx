import { getSuperAdminApiTokens } from "@/features/admin-profile/actions/admin-profile-actions";
import { TokenList } from "../components/token-list";
import { CreateTokenDialog } from "../components/create-token-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Key, ShieldCheck, Code, Terminal } from "lucide-react";

export default async function ApiTokensPage() {
  const tokens = await getSuperAdminApiTokens();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-900">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black">Super Admin API Tokens</h2>
            <p className="text-sm font-medium text-slate-500">Manage personal tokens for programmatic platform access.</p>
          </div>
        </div>
        <CreateTokenDialog />
      </div>

      <Card className="border-2 shadow-sm">
        <CardContent className="p-0">
          <TokenList tokens={tokens} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
           <div className="flex items-center gap-3">
              <Terminal className="h-6 w-6 text-emerald-400" />
              <h3 className="text-lg font-black">Documentation</h3>
           </div>
           <p className="text-slate-400 text-sm font-medium">
             Learn how to authenticate your requests using Bearer tokens in our platform API documentation.
           </p>
           <button className="text-emerald-400 font-bold text-sm hover:underline">View API Docs →</button>
        </div>
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
           <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
              <h3 className="text-lg font-black text-slate-900">Secure Access</h3>
           </div>
           <p className="text-slate-500 text-sm font-medium">
             API tokens inherit your Super Admin permissions. Scoping tokens helps minimize the impact if a token is compromised.
           </p>
        </div>
      </div>
    </div>
  );
}
