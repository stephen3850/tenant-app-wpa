"use client";

import { useState } from "react";
import { login } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, ArrowRight, CheckCircle2, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await login({ email, password });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Logged in successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F3F4F6] p-4 lg:p-8 font-sans">
       <div className="flex w-full max-w-6xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-gray-200/50">
          {/* Left Column - Branding/Info */}
          <div className="hidden w-1/2 relative bg-[#111827] p-16 lg:flex lg:flex-col lg:justify-between overflow-hidden">
             {/* Background Image */}
             <div className="absolute inset-0 z-0">
                <img
                   src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                   alt="Modern Building"
                   className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/40 to-transparent" />
             </div>

             <div className="relative z-10">
                <div className="flex items-center gap-3">
                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xl">
                      <Home className="h-7 w-7 text-[#111827]" />
                   </div>
                   <span className="text-3xl font-black tracking-tighter text-white">TMS</span>
                </div>
             </div>

             <div className="relative z-10 space-y-8">
                <h1 className="text-6xl font-extrabold leading-[1.05] tracking-tight text-white">
                  Institutional grade <br />
                  <span className="text-gray-400">property management.</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-md font-medium">
                  The standard for modern property portfolios in East Africa. Precision finance, seamless operations.
                </p>

                <div className="grid grid-cols-1 gap-4 pt-6">
                   <FeatureItem text="Automated Rent Collection" isDark />
                   <FeatureItem text="Smart Financial Reporting" isDark />
                   <FeatureItem text="Tenant & Lease Management" isDark />
                   <FeatureItem text="Maintenance Tracking" isDark />
                </div>
             </div>

             <div className="relative z-10 pt-8 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  #powered by{" "}
                  <Link
                    href="https://st-tech-innovation.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#56A600] hover:text-[#65a30d] transition-colors"
                  >
                    st-tech innovation
                  </Link>
                </p>
                <div className="text-[10px] font-semibold text-gray-500 tracking-wider">
                   © 2026 TMS ENTERPRISE. ALL RIGHTS RESERVED.
                </div>
             </div>
          </div>

          {/* Right Column - Form */}
          <div className="flex w-full flex-col justify-center p-8 md:p-16 lg:w-1/2">
             <div className="mx-auto w-full max-w-sm">
                <div className="lg:hidden flex justify-center mb-10">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111827]">
                            <Home className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-[#111827]">TMS</span>
                    </div>
                </div>

                <div className="mb-12 text-center lg:text-left">
                   <h2 className="text-4xl font-extrabold tracking-tight text-[#111827]">Welcome Back</h2>
                   <p className="mt-3 text-gray-500 font-medium">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-7">
                   <div className="space-y-5">
                      <div className="space-y-2.5">
                         <label className="text-sm font-bold text-[#111827] ml-1">Work Email</label>
                         <Input
                           name="email"
                           type="email"
                           required
                           placeholder="name@company.com"
                           className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 px-5 text-base focus:bg-white focus:ring-[#111827]/10 transition-all"
                         />
                      </div>
                      <div className="space-y-2.5">
                         <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-bold text-[#111827]">Password</label>
                            <Link href="/forgot-password" title="Forgot your password?" className="text-xs font-bold text-[#111827] hover:underline">
                               Forgot password?
                            </Link>
                         </div>
                         <Input
                           name="password"
                           type="password"
                           required
                           placeholder="••••••••"
                           className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 px-5 text-base focus:bg-white focus:ring-[#111827]/10 transition-all"
                         />
                      </div>
                   </div>

                   <div className="flex items-center gap-2 ml-1">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#111827] focus:ring-[#111827]" />
                      <span className="text-sm font-medium text-gray-500">Keep me signed in</span>
                   </div>

                   <Button
                     type="submit"
                     disabled={isLoading}
                     className="h-14 w-full rounded-2xl bg-[#111827] text-lg font-bold text-white hover:bg-black shadow-xl shadow-gray-200/50 transition-all active:scale-[0.98]"
                   >
                     {isLoading ? (
                        <span className="flex items-center gap-2">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Authenticating...
                        </span>
                     ) : (
                        <span className="flex items-center justify-center gap-2">
                           Sign In <ArrowRight className="h-5 w-5" />
                        </span>
                     )}
                   </Button>
                </form>

                <div className="mt-12 border-t border-gray-100 pt-10 text-center">
                   <p className="text-sm font-medium text-gray-500">
                      Don't have an account?{" "}
                      <Link href="/register" className="font-bold text-[#111827] hover:underline">
                         Create an Account
                      </Link>
                   </p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

function FeatureItem({ text, isDark }: { text: string; isDark?: boolean }) {
   return (
      <div className="flex items-center gap-3">
         <div className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full",
            isDark ? "bg-white/10 text-white" : "bg-[#65a30d]/10 text-[#65a30d]"
         )}>
            <CheckCircle2 className="h-3 w-3" />
         </div>
         <span className={cn(
            "text-sm font-medium",
            isDark ? "text-gray-300" : "text-gray-600"
         )}>{text}</span>
      </div>
   )
}
