import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthProvider from "@/contexts/AuthContext";
import AppRouter from "@/routes/AppRouter";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
