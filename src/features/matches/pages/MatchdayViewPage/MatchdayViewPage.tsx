import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./MatchdayViewPage.module.scss";

import { useMatches } from "../../hooks/useMatches";
import { MatchTable } from "../../components/MatchTable";
import { ActiveFilterTags } from "../../components/ActiveFilterTags";

import {
  MultiSelectDropdown,
  type DropdownOption,
} from "../../../../shared/components/MultiSelectDropdown";

import { LoadingState } from "../../../../shared/components/LoadingState";
import { ErrorState } from "../../../../shared/components/ErrorState";
import { EmptyState } from "../../../../shared/components/EmptyState";

export function MatchdayViewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const selectedMatchday = searchParams.get("matchday") ?? "";
  const selectedMatchdays = selectedMatchday ? [selectedMatchday] : [];

  const shouldFetchMatches = Boolean(selectedMatchday);

  const { data, isLoading, isError } = useMatches({
    page: 1,
    limit: 100,
    matchDay: shouldFetchMatches ? Number(selectedMatchday) : undefined,
  });

  const matchdayOptions: DropdownOption[] = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        label: `Matchday ${index + 1}`,
        value: String(index + 1),
      })),
    []
  );

  const handleToggleFilter = (id: string) => {
    setOpenFilter((current) => (current === id ? null : id));
  };

  const handleCloseFilter = () => {
    setOpenFilter(null);
  };

  const handleMatchdayChange = (values: string[]) => {
    const lastSelectedValue = values[values.length - 1];

    if (!lastSelectedValue) {
      setSearchParams({});
      setOpenFilter(null);
      return;
    }

    setSearchParams({ matchday: lastSelectedValue });
    setOpenFilter(null);
  };

  const handleRemoveMatchday = () => {
    setSearchParams({});
    setOpenFilter(null);
  };

  if (isLoading && shouldFetchMatches) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  const matches = shouldFetchMatches ? data?.matches ?? [] : [];

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2>Matchday Fixtures</h2>
        <p>Select a matchday to explore its scheduled fixtures.</p>
      </div>

      <div className={styles.selector}>
        <MultiSelectDropdown
          id="matchday-view-filter"
          label="Select matchday"
          options={matchdayOptions}
          selectedValues={selectedMatchdays}
          isOpen={openFilter === "matchday-view-filter"}
          onToggle={handleToggleFilter}
          onClose={handleCloseFilter}
          onChange={handleMatchdayChange}
        />
      </div>

      <ActiveFilterTags
        selectedTeams={[]}
        selectedMatchDays={selectedMatchdays}
        selectedCountries={[]}
        selectedVenues={[]}
        teamsOptions={[]}
        matchDaysOptions={matchdayOptions}
        countriesOptions={[]}
        venueOptions={[]}
        onRemoveTeam={() => undefined}
        onRemoveMatchDay={handleRemoveMatchday}
        onRemoveCountry={() => undefined}
        onRemoveVenue={() => undefined}
      />

      {!selectedMatchday ? (
        <EmptyState message="Select a matchday to see its fixtures." />
      ) : matches.length ? (
        <MatchTable matches={matches} />
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
