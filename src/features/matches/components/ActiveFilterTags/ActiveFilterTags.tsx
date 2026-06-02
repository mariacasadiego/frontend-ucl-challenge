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
    <div className={styles.tags} aria-label="Active filters">
      {selectedTeams.map((value) => {
        const label = getLabel(teamsOptions, value);

        return (
          <div key={`team-${value}`} className={styles.tag}>
            <span>Team: {label}</span>

            <button
              type="button"
              className={styles.remove}
              aria-label={`Remove ${label} filter`}
              onClick={() => onRemoveTeam(value)}
            >
              ×
            </button>
          </div>
        );
      })}

      {selectedMatchDays.map((value) => {
        const label = getLabel(matchDaysOptions, value);

        return (
          <div key={`matchday-${value}`} className={styles.tag}>
            <span>{label}</span>

            <button
              type="button"
              className={styles.remove}
              aria-label={`Remove ${label} filter`}
              onClick={() => onRemoveMatchDay(value)}
            >
              ×
            </button>
          </div>
        );
      })}

      {selectedCountries.map((value) => {
        const label = getLabel(countriesOptions, value);

        return (
          <div key={`country-${value}`} className={styles.tag}>
            <span>Country: {label}</span>

            <button
              type="button"
              className={styles.remove}
              aria-label={`Remove ${label} filter`}
              onClick={() => onRemoveCountry(value)}
            >
              ×
            </button>
          </div>
        );
      })}

      {selectedVenues.map((value) => {
        const label = getLabel(venueOptions, value);

        return (
          <div key={`venue-${value}`} className={styles.tag}>
            <span>Venue: {label}</span>

            <button
              type="button"
              className={styles.remove}
              aria-label={`Remove ${label} filter`}
              onClick={() => onRemoveVenue(value)}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
