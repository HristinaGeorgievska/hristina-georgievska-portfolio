import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import CollectionDetail from "@/pages/CollectionDetail";

// Mock useCollection hook
vi.mock("@/hooks/use-contentful", () => ({
  useCollection: vi.fn(),
}));

import { useCollection } from "@/hooks/use-contentful";

describe("CollectionDetail page", () => {
  it("renders branded NotFound 404 page when collection does not exist", () => {
    vi.mocked(useCollection).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useCollection>);

    render(
      <HelmetProvider context={{}}>
        <BrowserRouter>
          <CollectionDetail />
        </BrowserRouter>
      </HelmetProvider>
    );

    expect(screen.getByText("Error 404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /return to portfolio/i })).toBeInTheDocument();
  });

  it("renders error state when API fails", () => {
    vi.mocked(useCollection).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof useCollection>);

    render(
      <HelmetProvider context={{}}>
        <BrowserRouter>
          <CollectionDetail />
        </BrowserRouter>
      </HelmetProvider>
    );

    expect(screen.getByText(/failed to load collection/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /return to gallery/i })).toBeInTheDocument();
  });
});
