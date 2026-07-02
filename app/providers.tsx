"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { AccountsProvider } from "@/store/accounts";

export function Providers({ children }: { children: ReactNode }) {
  // Create the QueryClient once per browser session (lazy initial state) so it is
  // not recreated on every render and survives Fast Refresh.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AccountsProvider>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </AccountsProvider>
    </QueryClientProvider>
  );
}
