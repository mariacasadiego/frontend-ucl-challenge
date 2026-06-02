export interface Team {
  id: number;
  name: string;
  country: {
    id: number;
    name: string;
  };
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  matchDay: number;
}

export interface MatchesResponse {
  matches: Match[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
