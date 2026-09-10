"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onCheckedChange?: (checked: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
        <input
          type="checkbox"
          ref={ref}
          onChange={handleChange}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-[#E2E8F0] appearance-none cursor-pointer checked:bg-[#62A800] checked:border-[#62A800] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62A800]/20 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <Check
          className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
          strokeWidth={4}
        />
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
