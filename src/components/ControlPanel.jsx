function ControlPanel({
  roles,
  tracks,
  currentRole,
  targetRole,
  search,
  trackFilter,
  onCurrentRoleChange,
  onTargetRoleChange,
  onSearchChange,
  onTrackFilterChange,
  recommendedPath,
  missingSkills,
  skills,
}) {
  const skillMap = new Map(skills.map((skill) => [skill.id, skill.name]));

  return (
    <section className="panel">
      <div className="controls-grid">
        <label>
          Current role
          <select value={currentRole} onChange={(event) => onCurrentRoleChange(event.target.value)}>
            <option value="">Select current role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </label>

        <label>
          Target role
          <select value={targetRole} onChange={(event) => onTargetRoleChange(event.target.value)}>
            <option value="">Select target role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </label>

        <label>
          Search
          <input
            type="search"
            value={search}
            placeholder="Search roles or skills"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <label>
          Track filter
          <select value={trackFilter} onChange={(event) => onTrackFilterChange(event.target.value)}>
            <option value="all">All tracks</option>
            {tracks.map((track) => (
              <option key={track.id} value={track.id}>{track.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="insights">
        <h2>Recommended path</h2>
        <p>{recommendedPath.length > 0 ? recommendedPath.join(" → ") : "Choose current and target roles."}</p>
        <h3>Missing skills</h3>
        <ul>
          {missingSkills.length > 0 ? missingSkills.map((skillId) => <li key={skillId}>{skillMap.get(skillId) || skillId}</li>) : <li>No gap detected</li>}
        </ul>
      </div>
    </section>
  );
}

export default ControlPanel;
