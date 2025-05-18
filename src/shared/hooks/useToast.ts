import { useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, visible: true });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  return {
    toast,
    showToast,
    hideToast
  };
}
