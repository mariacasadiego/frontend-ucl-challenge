import type { DropdownOption } from "../../../../shared/components/MultiSelectDropdown";
import styles from "./ActiveFilterTags.module.scss";

interface ActiveFilterTagsProps {
  selectedTeams: string[];
  selectedMatchDays: string[];
  selectedCountries: string[];
  selectedVenues: string[];

  teamsOptions: DropdownOption[];
  matchDaysOptions: DropdownOption[];
  countriesOptions: DropdownOption[];
  venueOptions: DropdownOption[];

  onRemoveTeam: (value: string) => void;
  onRemoveMatchDay: (value: string) => void;
  onRemoveCountry: (value: string) => void;
  onRemoveVenue: (value: string) => void;
}

function getLabel(options: DropdownOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function ActiveFilterTags({
  selectedTeams,
  selectedMatchDays,
  selectedCountries,
  selectedVenues,
  teamsOptions,
  matchDaysOptions,
  countriesOptions,
  venueOptions,
  onRemoveTeam,
  onRemoveMatchDay,
  onRemoveCountry,
  onRemoveVenue,
}: ActiveFilterTagsProps) {
  const hasFilters =
    selectedTeams.length ||
    selectedMatchDays.length ||
    selectedCountries.length ||
    selectedVenues.length;

  if (!hasFilters) return null;

  return (
    <div className={styles.tags}>
      {selectedTeams.map((value) => (
        <div key={`team-${value}`} className={styles.tag}>
          <span>Team: {getLabel(teamsOptions, value)}</span>

          <button
            type="button"
            className={styles.remove}
            onClick={() => onRemoveTeam(value)}
          >
            ×
          </button>
        </div>
      ))}

      {selectedMatchDays.map((value) => (
        <div key={`matchday-${value}`} className={styles.tag}>
          <span>Matchday: {getLabel(matchDaysOptions, value)}</span>

          <button
            type="button"
            className={styles.remove}
            onClick={() => onRemoveMatchDay(value)}
          >
            ×
          </button>
        </div>
      ))}

      {selectedCountries.map((value) => (
        <div key={`country-${value}`} className={styles.tag}>
          <span>Country: {getLabel(countriesOptions, value)}</span>

          <button
            type="button"
            className={styles.remove}
            onClick={() => onRemoveCountry(value)}
          >
            ×
          </button>
        </div>
      ))}

      {selectedVenues.map((value) => (
        <div key={`venue-${value}`} className={styles.tag}>
          <span>Venue: {getLabel(venueOptions, value)}</span>

          <button
            type="button"
            className={styles.remove}
            onClick={() => onRemoveVenue(value)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
