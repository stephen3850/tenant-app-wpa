import { toast as sonnerToast } from "sonner";

export function useToast() {
  const toast = ({ title, description, variant }: { title?: string, description?: string, variant?: "default" | "destructive" }) => {
    const method = variant === "destructive" ? sonnerToast.error : sonnerToast.success;
    method(title, {
      description: description,
    });
  };

  return {
    toast,
  };
}
