import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./TeamViewPage.module.scss";

import { useMatches } from "../../hooks/useMatches";
import { MatchTable } from "../../components/MatchTable";
import { LoadingState } from "../../../../shared/components/LoadingState";
import { ErrorState } from "../../../../shared/components/ErrorState";
import { EmptyState } from "../../../../shared/components/EmptyState";
import {
  MultiSelectDropdown,
  type DropdownOption,
} from "../../../../shared/components/MultiSelectDropdown";
import { ActiveFilterTags } from "../../components/ActiveFilterTags";

export function TeamViewPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const teamIdFromUrl = searchParams.get("teamId") ?? "";
  const selectedTeamIds = teamIdFromUrl ? [teamIdFromUrl] : [];
  const selectedTeamId = selectedTeamIds[0] ?? "";
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const {
    data: allMatchesData,
    isLoading: isLoadingAllMatches,
    isError: isAllMatchesError,
  } = useMatches({
    page: 1,
    limit: 100,
  });

  const {
    data: teamMatchesData,
    isLoading: isLoadingTeamMatches,
    isError: isTeamMatchesError,
  } = useMatches({
    page: 1,
    limit: 100,
    teamId: selectedTeamId ? Number(selectedTeamId) : undefined,
  });

  const allMatches = allMatchesData?.matches ?? [];
  const selectedMatches = selectedTeamId
    ? (teamMatchesData?.matches ?? [])
    : [];

  const teamOptions: DropdownOption[] = useMemo(() => {
    const teamsMap = new Map<string, DropdownOption>();

    allMatches.forEach((match) => {
      teamsMap.set(String(match.homeTeam.id), {
        label: match.homeTeam.name,
        value: String(match.homeTeam.id),
      });

      teamsMap.set(String(match.awayTeam.id), {
        label: match.awayTeam.name,
        value: String(match.awayTeam.id),
      });
    });

    return Array.from(teamsMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }, [allMatches]);

  const handleTeamChange = (values: string[]) => {
    const lastSelectedValue = values[values.length - 1];

    if (!lastSelectedValue) {
      setSearchParams({});
      setOpenFilter(null);
      return;
    }

    setSearchParams({ teamId: lastSelectedValue });
    setOpenFilter(null);
  };

  const homeMatches = selectedMatches.filter(
    (match) => match.homeTeam.id === Number(selectedTeamId),
  ).length;

  const awayMatches = selectedMatches.filter(
    (match) => match.awayTeam.id === Number(selectedTeamId),
  ).length;

  const selectedMatchDays: string[] = [];
  const selectedCountries: string[] = [];
  const selectedVenues: string[] = [];

  const handleRemoveTeam = (value: string) => {
    if (value === selectedTeamId) {
      setSearchParams({});
      setOpenFilter(null);
    }
  };

  const handleRemoveMatchDay = (_value: string) => {};
  const handleRemoveCountry = (_value: string) => {};
  const handleRemoveVenue = (_value: string) => {};

  if (isLoadingAllMatches || isLoadingTeamMatches) {
    return <LoadingState />;
  }

  if (isAllMatchesError || isTeamMatchesError) {
    return <ErrorState />;
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2>Team Fixtures</h2>
        <p>Select a team to explore its 8 league phase fixtures.</p>
      </div>

      <div className={styles.selector}>
        <MultiSelectDropdown
          id="team-view-team"
          label="Select team"
          options={teamOptions}
          selectedValues={selectedTeamIds}
          isOpen={openFilter === "team-view-team"}
          onToggle={(id) =>
            setOpenFilter((current) => (current === id ? null : id))
          }
          onChange={handleTeamChange}
        />
      </div>

      <ActiveFilterTags
        selectedTeams={selectedTeamIds}
        selectedMatchDays={selectedMatchDays}
        selectedCountries={selectedCountries}
        selectedVenues={selectedVenues}
        teamsOptions={teamOptions}
        matchDaysOptions={[]}
        countriesOptions={[]}
        venueOptions={[]}
        onRemoveTeam={handleRemoveTeam}
        onRemoveMatchDay={handleRemoveMatchDay}
        onRemoveCountry={handleRemoveCountry}
        onRemoveVenue={handleRemoveVenue}
      />

      {selectedTeamId && (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <strong>{selectedMatches.length}</strong>
            <span>Total fixtures</span>
          </div>

          <div className={styles.statCard}>
            <strong>{homeMatches}</strong>
            <span>Home</span>
          </div>

          <div className={styles.statCard}>
            <strong>{awayMatches}</strong>
            <span>Away</span>
          </div>
        </div>
      )}

      {!selectedTeamId ? (
        <EmptyState message="Select a team to see its fixtures." />
      ) : selectedMatches.length ? (
        <MatchTable matches={selectedMatches} />
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
