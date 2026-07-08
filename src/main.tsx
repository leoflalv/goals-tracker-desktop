import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getCurrentWindow } from "@tauri-apps/api/window";

import { ManageWindowRoot } from "@/features/manage-window/components";

import App from "./App";

const queryClient = new QueryClient();

const isManageWindow = getCurrentWindow().label === "manage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {isManageWindow ? <ManageWindowRoot /> : <App />}
    </QueryClientProvider>
  </React.StrictMode>,
);
