import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InventoryManagement from "./components/pages/inventoryManagement";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./route/protectedRoute";
import { LoginPage } from "./components/auth/login";
import { RegisterPage } from "./components/auth/register";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DashboardPage } from "./components/pages/inviteDashboard";
import { Toaster } from "./components/ui/sonner";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/register" element={<RegisterPage />}/>
            <Route path="/login" element={ <LoginPage />}/>

            <Route element={<ProtectedRoute/>}>
               <Route path="/inventory" element={<InventoryManagement />}/>
               <Route path="/dashboard" element={<DashboardPage/>} />
            </Route>
            

            <Route path="*" element={<Navigate to="/login" replace />} />
           
          </Routes>
           <Toaster />
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;