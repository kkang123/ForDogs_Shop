import { QueryClient, QueryClientProvider } from "react-query";
import AuthProvider from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

import AppRouter from "@/routes/AppRouter";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
