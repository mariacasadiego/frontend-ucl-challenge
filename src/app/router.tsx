import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "../shared/components/Layout";
import { MatchesPage } from "../features/matches/pages/MatchesPage";
import { TeamViewPage } from "../features/matches/pages/TeamViewPage";
import { MatchdayViewPage } from "../features/matches/pages/MatchdayViewPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/fixtures" replace />,
  },
  {
    path: "/fixtures",
    element: (
      <Layout>
        <MatchesPage />
      </Layout>
    ),
  },
  {
    path: "/team-view",
    element: (
      <Layout>
        <TeamViewPage />
      </Layout>
    ),
  },
  {
    path: "/matchday-view",
    element: (
      <Layout>
        <MatchdayViewPage />
      </Layout>
    ),
  },
]);
