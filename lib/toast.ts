import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

/**
 * Generic toast helpers for homescout.
 *
 * Usage:
 *   toast.success("Listing created!")
 *   toast.error("Failed to submit", { description: "Please try again." })
 *   toast.loading("Saving changes...")
 *   toast.promise(myPromise, { loading: "...", success: "Done!", error: "Oops!" })
 */
export const toast = {
  success: (message: string, opts?: ToastOptions) =>
    sonnerToast.success(message, opts),

  error: (message: string, opts?: ToastOptions) =>
    sonnerToast.error(message, opts),

  warning: (message: string, opts?: ToastOptions) =>
    sonnerToast.warning(message, opts),

  info: (message: string, opts?: ToastOptions) =>
    sonnerToast.info(message, opts),

  loading: (message: string, opts?: ToastOptions) =>
    sonnerToast.loading(message, opts),

  /**
   * Promise toast — shows loading state then resolves to success or error.
   *
   * toast.promise(submitForm(), {
   *   loading: "Submitting...",
   *   success: "Form submitted!",
   *   error: "Something went wrong.",
   * });
   */
  promise: <T>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
      description?: string;
    }
  ) => sonnerToast.promise(promise, msgs),

  /** Dismiss a specific or all toasts */
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
};
