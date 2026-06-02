import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./MatchesPage.module.scss";

import { useMatches } from "../../hooks/useMatches";

import { MatchTable } from "../../components/MatchTable";
import { MatchFilters } from "../../components/MatchFilters";
import { ActiveFilterTags } from "../../components/ActiveFilterTags";
import { Pagination } from "../../components/Pagination";

import { LoadingState } from "../../../../shared/components/LoadingState";
import { ErrorState } from "../../../../shared/components/ErrorState";
import { EmptyState } from "../../../../shared/components/EmptyState";

export function MatchesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedMatchDays, setSelectedMatchDays] = useState<string[]>(() => {
    const matchdayParam = searchParams.get("matchday");
    return matchdayParam ? matchdayParam.split(",").filter(Boolean) : [];
  });
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const rawPage = Number(searchParams.get("page") ?? "1");
    return Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  });

  const itemsPerPage = 12;

  const { data, isLoading, isError } = useMatches({
    page: 1,
    limit: 100,
  });

  const matches = data?.matches ?? [];

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
      a.label.localeCompare(b.label),
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
      a.label.localeCompare(b.label),
    );
  }, [matches]);

  const matchDaysOptions = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        label: `Matchday ${index + 1}`,
        value: String(index + 1),
      })),
    [],
  );

  const venueOptions = useMemo(
    () => [
      { label: "Home", value: "home" },
      { label: "Away", value: "away" },
    ],
    [],
  );

  useEffect(() => {
    const matchdayParam = searchParams.get("matchday");
    const valuesFromQuery = matchdayParam
      ? matchdayParam.split(",").filter(Boolean)
      : [];
    const rawPage = Number(searchParams.get("page") ?? "1");
    const pageFromQuery =
      Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

    setSelectedMatchDays((currentValues) => {
      const isSameLength = currentValues.length === valuesFromQuery.length;
      const hasSameValues =
        isSameLength &&
        currentValues.every((value, index) => value === valuesFromQuery[index]);

      return hasSameValues ? currentValues : valuesFromQuery;
    });

    setCurrentPage((current) =>
      current === pageFromQuery ? current : pageFromQuery,
    );
  }, [searchParams]);

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

        const isSelectedTeamHome = selectedTeamSet.has(homeTeamId);
        const isSelectedTeamAway = selectedTeamSet.has(awayTeamId);

        return (
          (selectedVenues.includes("home") && isSelectedTeamHome) ||
          (selectedVenues.includes("away") && isSelectedTeamAway)
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

  const updateSearchParams = ({
    page,
    matchday,
  }: {
    page?: string | null;
    matchday?: string | null;
  }) => {
    const nextParams = new URLSearchParams(searchParams);

    if (page !== undefined) {
      if (page) nextParams.set("page", page);
      else nextParams.delete("page");
    }

    if (matchday !== undefined) {
      if (matchday) nextParams.set("matchday", matchday);
      else nextParams.delete("matchday");
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams);
    }
  };

  const resetPage = () => {
    setCurrentPage(1);
    updateSearchParams({ page: "1" });
  };

  const handleTeamsChange = (values: string[]) => {
    setSelectedTeams(values);
    resetPage();
  };

  const handleMatchDaysChange = (values: string[]) => {
    setSelectedMatchDays(values);
    updateSearchParams({ matchday: values.length ? values.join(",") : null });
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

  const handleRemoveTeam = (value: string) => {
    handleTeamsChange(selectedTeams.filter((item) => item !== value));
  };

  const handleRemoveMatchDay = (value: string) => {
    handleMatchDaysChange(selectedMatchDays.filter((item) => item !== value));
  };

  const handleRemoveCountry = (value: string) => {
    handleCountriesChange(selectedCountries.filter((item) => item !== value));
  };

  const handleRemoveVenue = (value: string) => {
    handleVenuesChange(selectedVenues.filter((item) => item !== value));
  };

  const handleClearFilters = () => {
    setSelectedTeams([]);
    setSelectedMatchDays([]);
    setSelectedCountries([]);
    setSelectedVenues([]);
    updateSearchParams({ matchday: null, page: "1" });
    resetPage();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams({ page: String(page) });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
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
        onRemoveTeam={handleRemoveTeam}
        onRemoveMatchDay={handleRemoveMatchDay}
        onRemoveCountry={handleRemoveCountry}
        onRemoveVenue={handleRemoveVenue}
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
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
