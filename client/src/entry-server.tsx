import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dehydrate, DehydratedState } from "@tanstack/react-query";
import App from "./App";

export interface RenderResult {
  html: string;
  dehydratedState: DehydratedState;
}

// Static location hook for SSR
const staticLocationHook = (path: string) => () => [path, () => {}] as [string, (to: string) => void];

export async function render(url: string, queryClient?: QueryClient): Promise<RenderResult> {
  // Use provided queryClient or create a new one
  const client = queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: false,
      },
    },
  });

  // Render the app with wouter's static location hook for SSR
  const html = renderToString(
    <Router hook={staticLocationHook(url)}>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    </Router>
  );

  // Dehydrate the query cache for hydration on the client
  const dehydratedState = dehydrate(client);

  return { html, dehydratedState };
}
