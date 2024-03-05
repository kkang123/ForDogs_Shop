import { QueryClient, QueryClientProvider } from "react-query";
import AuthProvider from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { HelmetProvider } from "react-helmet-async";

import AppRouter from "@/routes/AppRouter";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <AppRouter />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
