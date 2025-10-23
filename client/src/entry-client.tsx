import { hydrateRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

// Get dehydrated state from window
const dehydratedState = (window as any).__REACT_QUERY_STATE__;

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

// Hydrate React
hydrateRoot(
  document.getElementById("root")!,
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={dehydratedState}>
      <App />
    </HydrationBoundary>
  </QueryClientProvider>
);
