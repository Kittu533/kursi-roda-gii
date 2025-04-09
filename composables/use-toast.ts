import { provide, inject } from 'vue';

interface Toast {
  show: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface ShowToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface ToastContext {
  toast: Ref<Toast>;
  showToast: (options: ShowToastOptions) => void;
}

const toastSymbol = Symbol('toast');

export function provideToast(): ToastContext {
  const toast = ref<Toast>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showToast = ({ type = 'success', title, message, duration = 3000 }: ShowToastOptions) => {
    toast.value = {
      show: true,
      type,
      title,
      message,
    };

    // Auto hide toast after duration
    setTimeout(() => {
      toast.value.show = false;
    }, duration);
  };

  provide(toastSymbol, { toast, showToast });

  return { toast, showToast };
}

export function useToast(): ToastContext {
  const context = inject<ToastContext>(toastSymbol);

  if (!context) {
    throw new Error('useToast must be used within a component that has called provideToast');
  }

  return context;
}