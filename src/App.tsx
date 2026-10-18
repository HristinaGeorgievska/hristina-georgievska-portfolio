import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";

import Index from "./pages/Index";
const CollectionDetail = React.lazy(() => import("./pages/CollectionDetail"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 24-hour in-memory lifetime; the localStorage persister extends this
      // across page refreshes so revisits are instant.
      gcTime: 24 * 60 * 60 * 1000,
    },
  },
});

// Persist the full React Query cache to localStorage.
// Versioned key means old serialized caches are automatically discarded
// when we deploy breaking data-shape changes.
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "hristina-portfolio-rq-cache-v1",
});

const FallbackLoader = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-muted/30 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

import { HelmetProvider } from "react-helmet-async";

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: localStoragePersister }}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<FallbackLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<Index />} />
                <Route path="/fashion" element={<Index />} />
                <Route path="/beauty" element={<Index />} />
                <Route path="/advertising" element={<Index />} />
                <Route path="/video" element={<Index />} />
                <Route path="/contact" element={<Index />} />
                <Route path="/collection/:slug" element={<CollectionDetail />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </PersistQueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
