import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ActiveFilterTags } from "../ActiveFilterTags";

describe("ActiveFilterTags", () => {
  it("removes a team filter when clicking the remove button", async () => {
    const user = userEvent.setup();

    const onRemoveTeam = vi.fn();

    render(
      <ActiveFilterTags
        selectedTeams={["117"]}
        selectedMatchDays={[]}
        selectedCountries={[]}
        selectedVenues={[]}
        teamsOptions={[{ label: "Barcelona", value: "117" }]}
        matchDaysOptions={[]}
        countriesOptions={[]}
        venueOptions={[]}
        onRemoveTeam={onRemoveTeam}
        onRemoveMatchDay={vi.fn()}
        onRemoveCountry={vi.fn()}
        onRemoveVenue={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /remove barcelona filter/i,
      })
    );

    expect(onRemoveTeam).toHaveBeenCalledTimes(1);
    expect(onRemoveTeam).toHaveBeenCalledWith("117");
  });
});