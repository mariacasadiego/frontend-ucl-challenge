import { useQuery } from "@tanstack/react-query";
import { getMatches, type MatchFilters } from "../../../api/matches.api";

export function useMatches(filters: MatchFilters) {
  return useQuery({
    queryKey: ["matches", filters],
    queryFn: () => getMatches(filters),
  });
}
