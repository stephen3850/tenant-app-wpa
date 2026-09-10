import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("w-full py-6 px-8 border-t bg-white", className)}>
      <div className="flex items-center justify-center">
        <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-[0.2em]">
          #powered by{" "}
          <Link
            href="https://st-tech-innovation.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#56A600] hover:text-[#4a8e00] transition-colors"
          >
            st-tech innovation
          </Link>
        </p>
      </div>
    </footer>
  );
}
