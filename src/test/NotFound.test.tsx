import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "@/pages/NotFound";

describe("NotFound component", () => {
  it("renders branded 404 message and return link", () => {
    const helmetContext = {};

    render(
      <HelmetProvider context={helmetContext}>
        <BrowserRouter>
          <NotFound />
        </BrowserRouter>
      </HelmetProvider>
    );

    expect(screen.getByText("Error 404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /return to portfolio/i })).toHaveAttribute("href", "/");
    expect(screen.getByText(/hristina georgievska/i, { selector: "p" })).toBeInTheDocument();
  });
});
