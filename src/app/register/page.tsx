"use client";

import { useState } from "react";
import { register } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, UserPlus, ArrowRight, Home } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const organizationName = formData.get("organizationName") as string;

    try {
      const result = await register({ email, password, name, organizationName });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
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
        {/* Left Column - Branding */}
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
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#111827]">Create Account</h2>
              <p className="mt-3 text-gray-500 font-medium text-sm">Fill in the details to get started with your 14-day free trial.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#111827] ml-1" htmlFor="organizationName">
                    Organization Name
                  </label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    required
                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-5 text-sm focus:bg-white focus:ring-[#111827]/10 transition-all"
                    placeholder="e.g. Skyline Properties"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#111827] ml-1" htmlFor="name">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-5 text-sm focus:bg-white focus:ring-[#111827]/10 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#111827] ml-1" htmlFor="email">
                    Work Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-5 text-sm focus:bg-white focus:ring-[#111827]/10 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#111827] ml-1" htmlFor="password">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-5 text-sm focus:bg-white focus:ring-[#111827]/10 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-14 w-full rounded-2xl bg-[#111827] text-lg font-bold text-white hover:bg-black shadow-xl shadow-gray-200/50 transition-all active:scale-[0.98] mt-4"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Get Started <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-10 border-t border-gray-100 pt-8 text-center">
              <p className="text-sm font-medium text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-[#111827] hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
