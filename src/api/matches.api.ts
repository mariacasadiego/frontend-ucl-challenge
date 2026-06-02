import { http } from "./http";
import type { MatchesResponse } from "../features/matches/types/match";

export interface MatchFilters {
  teamId?: number;
  matchDay?: number;
  page?: number;
  limit?: number;
}

export async function getMatches(
  filters: MatchFilters,
): Promise<MatchesResponse> {
  const { data } = await http.get<MatchesResponse>("/matches", {
    params: filters,
  });

  return data;
}
