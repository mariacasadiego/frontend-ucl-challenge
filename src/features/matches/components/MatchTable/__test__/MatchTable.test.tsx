import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MatchTable } from "../MatchTable";
import type { Match } from "../../../types/match";

const matches: Match[] = [
  {
    id: "1",
    matchDay: 1,
    homeTeam: {
      id: 117,
      name: "Barcelona",
      country: {
        id: 49,
        name: "Spain",
      },
    },
    awayTeam: {
      id: 113,
      name: "Liverpool",
      country: {
        id: 50,
        name: "England",
      },
    },
  },
];

describe("MatchTable", () => {
  it("renders fixture information", () => {
    render(<MatchTable matches={matches} />);

    expect(screen.getAllByText("Barcelona").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Liverpool").length).toBeGreaterThan(0);

    expect(screen.getAllByText("Spain").length).toBeGreaterThan(0);
    expect(screen.getAllByText("England").length).toBeGreaterThan(0);

    expect(screen.getAllByText(/match day/i).length).toBeGreaterThan(0);
  });
});