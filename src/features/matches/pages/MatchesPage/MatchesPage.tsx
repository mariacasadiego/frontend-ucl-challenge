import { useMemo, useState } from "react";
import styles from "./MatchesPage.module.scss";

import { useMatches } from "../../hooks/useMatches";

import { MatchTable } from "../../components/MatchTable";
import { MatchFilters } from "../../components/MatchFilters";
import { Pagination } from "../../components/Pagination";
import { ActiveFilterTags } from "../../components/ActiveFilterTags";

import { LoadingState } from "../../../../shared/components/LoadingState";
import { ErrorState } from "../../../../shared/components/ErrorState";
import { EmptyState } from "../../../../shared/components/EmptyState";

export function MatchesPage() {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedMatchDays, setSelectedMatchDays] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  const {
    data: firstPageData,
    isLoading: isLoadingFirstPage,
    isError: isErrorFirstPage,
  } = useMatches({
    page: 1,
    limit: 100,
  });

  const {
    data: secondPageData,
    isLoading: isLoadingSecondPage,
    isError: isErrorSecondPage,
  } = useMatches({
    page: 2,
    limit: 100,
  });

  const matches = useMemo(() => {
    return [
      ...(firstPageData?.matches ?? []),
      ...(secondPageData?.matches ?? []),
    ];
  }, [firstPageData?.matches, secondPageData?.matches]);

  const teamsOptions = useMemo(() => {
    const teams = new Map<string, { label: string; value: string }>();

    matches.forEach((match) => {
      teams.set(String(match.homeTeam.id), {
        label: match.homeTeam.name,
        value: String(match.homeTeam.id),
      });

      teams.set(String(match.awayTeam.id), {
        label: match.awayTeam.name,
        value: String(match.awayTeam.id),
      });
    });

    return Array.from(teams.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [matches]);

  const countriesOptions = useMemo(() => {
    const countries = new Map<string, { label: string; value: string }>();

    matches.forEach((match) => {
      countries.set(String(match.homeTeam.country.id), {
        label: match.homeTeam.country.name,
        value: String(match.homeTeam.country.id),
      });

      countries.set(String(match.awayTeam.country.id), {
        label: match.awayTeam.country.name,
        value: String(match.awayTeam.country.id),
      });
    });

    return Array.from(countries.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [matches]);

  const matchDaysOptions = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        label: `Matchday ${index + 1}`,
        value: String(index + 1),
      })),
    []
  );

  const venueOptions = useMemo(
    () => [
      { label: "Home", value: "home" },
      { label: "Away", value: "away" },
    ],
    []
  );

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const homeTeamId = String(match.homeTeam.id);
      const awayTeamId = String(match.awayTeam.id);

      const homeCountryId = String(match.homeTeam.country.id);
      const awayCountryId = String(match.awayTeam.country.id);

      const matchesTeam =
        selectedTeams.length === 0 ||
        selectedTeams.includes(homeTeamId) ||
        selectedTeams.includes(awayTeamId);

      const matchesMatchday =
        selectedMatchDays.length === 0 ||
        selectedMatchDays.includes(String(match.matchDay));

      const matchesCountry =
        selectedCountries.length === 0 ||
        selectedCountries.includes(homeCountryId) ||
        selectedCountries.includes(awayCountryId);

      const matchesVenue = (() => {
        if (selectedVenues.length === 0) {
          return true;
        }

        if (selectedTeams.length === 0) {
          return true;
        }

        const selectedTeamSet = new Set(selectedTeams);

        const selectedTeamIsHome = selectedTeamSet.has(homeTeamId);
        const selectedTeamIsAway = selectedTeamSet.has(awayTeamId);

        return (
          (selectedVenues.includes("home") && selectedTeamIsHome) ||
          (selectedVenues.includes("away") && selectedTeamIsAway)
        );
      })();

      return matchesTeam && matchesMatchday && matchesCountry && matchesVenue;
    });
  }, [
    matches,
    selectedTeams,
    selectedMatchDays,
    selectedCountries,
    selectedVenues,
  ]);

  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);

  const paginatedMatches = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return filteredMatches.slice(start, end);
  }, [filteredMatches, currentPage]);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const handleTeamsChange = (values: string[]) => {
    setSelectedTeams(values);
    resetPage();
  };

  const handleMatchDaysChange = (values: string[]) => {
    setSelectedMatchDays(values);
    resetPage();
  };

  const handleCountriesChange = (values: string[]) => {
    setSelectedCountries(values);
    resetPage();
  };

  const handleVenuesChange = (values: string[]) => {
    setSelectedVenues(values);
    resetPage();
  };

  const handleClearFilters = () => {
    setSelectedTeams([]);
    setSelectedMatchDays([]);
    setSelectedCountries([]);
    setSelectedVenues([]);
    resetPage();
  };

  if (isLoadingFirstPage || isLoadingSecondPage) {
    return <LoadingState />;
  }

  if (isErrorFirstPage || isErrorSecondPage) {
    return <ErrorState />;
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>League Phase Fixtures</h2>

      <MatchFilters
        teamsOptions={teamsOptions}
        matchDaysOptions={matchDaysOptions}
        countriesOptions={countriesOptions}
        venueOptions={venueOptions}
        selectedTeams={selectedTeams}
        selectedMatchDays={selectedMatchDays}
        selectedCountries={selectedCountries}
        selectedVenues={selectedVenues}
        onTeamsChange={handleTeamsChange}
        onMatchDaysChange={handleMatchDaysChange}
        onCountriesChange={handleCountriesChange}
        onVenuesChange={handleVenuesChange}
        onClear={handleClearFilters}
      />

      <ActiveFilterTags
        selectedTeams={selectedTeams}
        selectedMatchDays={selectedMatchDays}
        selectedCountries={selectedCountries}
        selectedVenues={selectedVenues}
        teamsOptions={teamsOptions}
        matchDaysOptions={matchDaysOptions}
        countriesOptions={countriesOptions}
        venueOptions={venueOptions}
        onRemoveTeam={(value) => {
          setSelectedTeams((current) =>
            current.filter((item) => item !== value)
          );
          resetPage();
        }}
        onRemoveMatchDay={(value) => {
          setSelectedMatchDays((current) =>
            current.filter((item) => item !== value)
          );
          resetPage();
        }}
        onRemoveCountry={(value) => {
          setSelectedCountries((current) =>
            current.filter((item) => item !== value)
          );
          resetPage();
        }}
        onRemoveVenue={(value) => {
          setSelectedVenues((current) =>
            current.filter((item) => item !== value)
          );
          resetPage();
        }}
      />

      {!paginatedMatches.length ? (
        <EmptyState />
      ) : (
        <>
          <MatchTable matches={paginatedMatches} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredMatches.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
}
