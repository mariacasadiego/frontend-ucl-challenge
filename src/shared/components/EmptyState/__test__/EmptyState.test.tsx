import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  it("renders empty state message", () => {
    render(<EmptyState />);

    expect(screen.getByText(/no matches found/i)).toBeInTheDocument();
  });
});