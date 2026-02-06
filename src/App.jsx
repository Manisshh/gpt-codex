import { useMemo, useState } from "react";
import CareerGraph from "./components/CareerGraph";
import ControlPanel from "./components/ControlPanel";
import useCareerData from "./hooks/useCareerData";
import { findShortestPath, getMissingSkillsForPath } from "./utils/pathing";

function App() {
  const { dataset, loading, error } = useCareerData("core-careers");
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");

  const recommendedPath = useMemo(() => {
    if (!dataset || !currentRole || !targetRole) return [];
    return findShortestPath(dataset.transitions, currentRole, targetRole);
  }, [dataset, currentRole, targetRole]);

  const missingSkills = useMemo(() => {
    if (!dataset || recommendedPath.length === 0) return [];
    return getMissingSkillsForPath(dataset, recommendedPath, currentRole);
  }, [dataset, recommendedPath, currentRole]);

  if (loading) return <p className="state">Loading career graph…</p>;
  if (error) return <p className="state error">Failed to load data: {error.message}</p>;

  return (
    <main className="layout">
      <h1>Career Path Visualization Platform</h1>
      <ControlPanel
        roles={dataset.roles}
        tracks={dataset.tracks}
        currentRole={currentRole}
        targetRole={targetRole}
        search={search}
        trackFilter={trackFilter}
        onCurrentRoleChange={setCurrentRole}
        onTargetRoleChange={setTargetRole}
        onSearchChange={setSearch}
        onTrackFilterChange={setTrackFilter}
        recommendedPath={recommendedPath}
        missingSkills={missingSkills}
        skills={dataset.skills}
      />
      <CareerGraph
        dataset={dataset}
        search={search}
        trackFilter={trackFilter}
        recommendedPath={recommendedPath}
      />
    </main>
  );
}

export default App;
