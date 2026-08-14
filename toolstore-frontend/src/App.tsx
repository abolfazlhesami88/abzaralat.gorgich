import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes/AppRoutes';
import { useAuthStore } from './stores/authStore';
import { useCartStore } from './stores/cartStore';
import { ScrollToTop } from './components/shared/ScrollToTop';
import { queryClient } from './api/queryClient';

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    initAuth();
    fetchCart();
  }, [initAuth, fetchCart]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
        {/* Toaster واحد برای تمام layout‌ها */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'inherit',
              direction: 'rtl',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
