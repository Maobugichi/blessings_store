import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InventoryManagement from "./components/pages/inventoryManagement";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <InventoryManagement />
    </QueryClientProvider>
  );
};

export default App;