import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Header from "@/components/Header";

describe("Header component", () => {
  it("renders h1 by default on main routes", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header />
      </MemoryRouter>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/hristina georgievska/i);
    expect(screen.queryByRole("link", { name: /hristina georgievska/i })).not.toBeInTheDocument();
  });

  it("renders non-h1 link when asH1={false}", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header asH1={false} />
      </MemoryRouter>
    );

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    const link = screen.getByRole("link", { name: /hristina georgievska/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("automatically renders non-h1 link when on a /collection/* subpage", () => {
    render(
      <MemoryRouter initialEntries={["/collection/beauty-10"]}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    const link = screen.getByRole("link", { name: /hristina georgievska/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
