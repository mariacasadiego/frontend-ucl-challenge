import { useState } from "react";
import {
  MultiSelectDropdown,
  type DropdownOption,
} from "../../../../shared/components/MultiSelectDropdown";
import styles from "./MatchFilters.module.scss";

interface MatchFiltersProps {
  teamsOptions: DropdownOption[];
  matchDaysOptions: DropdownOption[];
  countriesOptions: DropdownOption[];
  venueOptions: DropdownOption[];

  selectedTeams: string[];
  selectedMatchDays: string[];
  selectedCountries: string[];
  selectedVenues: string[];

  onTeamsChange: (values: string[]) => void;
  onMatchDaysChange: (values: string[]) => void;
  onCountriesChange: (values: string[]) => void;
  onVenuesChange: (values: string[]) => void;
  onClear: () => void;
}

export function MatchFilters({
  teamsOptions,
  matchDaysOptions,
  countriesOptions,
  venueOptions,
  selectedTeams,
  selectedMatchDays,
  selectedCountries,
  selectedVenues,
  onTeamsChange,
  onMatchDaysChange,
  onCountriesChange,
  onVenuesChange,
  onClear,
}: MatchFiltersProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const handleToggleFilter = (id: string) => {
    setOpenFilter((current) => (current === id ? null : id));
  };

  const handleCloseFilter = () => {
    setOpenFilter(null);
  };

  const handleClear = () => {
    setOpenFilter(null);
    onClear();
  };

  const canFilterByVenue = selectedTeams.length > 0;

  return (
    <section className={styles.filters}>
      <MultiSelectDropdown
        id="teams"
        label="Teams"
        options={teamsOptions}
        selectedValues={selectedTeams}
        isOpen={openFilter === "teams"}
        onToggle={handleToggleFilter}
        onClose={handleCloseFilter}
        onChange={onTeamsChange}
      />

      <MultiSelectDropdown
        id="matchDays"
        label="Matchday"
        options={matchDaysOptions}
        selectedValues={selectedMatchDays}
        isOpen={openFilter === "matchDays"}
        onToggle={handleToggleFilter}
        onClose={handleCloseFilter}
        onChange={onMatchDaysChange}
      />

      <MultiSelectDropdown
        id="countries"
        label="Countries"
        options={countriesOptions}
        selectedValues={selectedCountries}
        isOpen={openFilter === "countries"}
        onToggle={handleToggleFilter}
        onClose={handleCloseFilter}
        onChange={onCountriesChange}
      />

      <MultiSelectDropdown
        id="venues"
        label="Venue"
        options={canFilterByVenue ? venueOptions : []}
        selectedValues={selectedVenues}
        emptyMessage="Select at least one team first to use this filter."
        isOpen={openFilter === "venues"}
        onToggle={handleToggleFilter}
        onClose={handleCloseFilter}
        onChange={onVenuesChange}
      />

      <button
        className={styles.clearButton}
        type="button"
        onClick={handleClear}
      >
        Clear filters
      </button>
    </section>
  );
}
