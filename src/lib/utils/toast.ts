import { toast } from "sonner";

// Re-export raw toast for cases that need it directly
export { toast };

/**
 * RATIO-themed toast helpers.
 * Usage: courtToast.success("Profile updated")
 */
export const courtToast = {
  success: (message: string, description?: string) =>
    toast.success(message, { description }),
  error: (message: string, description?: string) =>
    toast.error(message, { description }),
  info: (message: string, description?: string) =>
    toast(message, { description }),
  promise: <T>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string }
  ) => toast.promise(promise, msgs),
};
