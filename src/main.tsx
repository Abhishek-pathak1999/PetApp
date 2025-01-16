import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { TabProvider } from "./TabContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TabProvider>
        <App />
      </TabProvider>
    </QueryClientProvider>
  </React.StrictMode>
  
);
