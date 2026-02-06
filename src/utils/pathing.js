function buildAdjacency(transitions) {
  const adjacency = new Map();
  transitions.forEach((transition) => {
    if (!adjacency.has(transition.fromRoleId)) adjacency.set(transition.fromRoleId, []);
    adjacency.get(transition.fromRoleId).push(transition.toRoleId);
  });
  return adjacency;
}

export function findShortestPath(transitions, fromRoleId, toRoleId) {
  if (!fromRoleId || !toRoleId) return [];
  if (fromRoleId === toRoleId) return [fromRoleId];

  const adjacency = buildAdjacency(transitions);
  const queue = [[fromRoleId]];
  const visited = new Set([fromRoleId]);

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];
    if (node === toRoleId) return path;

    const next = adjacency.get(node) || [];
    next.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    });
  }

  return [];
}

export function findTopPaths(transitions, fromRoleId, toRoleId, limit = 3) {
  if (!fromRoleId || !toRoleId) return [];
  if (fromRoleId === toRoleId) return [[fromRoleId]];

  const adjacency = buildAdjacency(transitions);
  const queue = [[fromRoleId]];
  const results = [];

  while (queue.length > 0 && results.length < limit) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === toRoleId) {
      results.push(path);
      continue;
    }

    const next = adjacency.get(node) || [];
    next.forEach((neighbor) => {
      if (!path.includes(neighbor)) {
        queue.push([...path, neighbor]);
      }
    });
  }

  return results;
}

export function getMissingSkillsForPath(dataset, path, currentRoleId) {
  const rolesById = new Map(dataset.roles.map((role) => [role.id, role]));
  const currentSkills = new Set((rolesById.get(currentRoleId)?.requiredSkills || []).concat(rolesById.get(currentRoleId)?.optionalSkills || []));

  const requiredAlongPath = new Set();
  path.forEach((roleId) => {
    const role = rolesById.get(roleId);
    (role?.requiredSkills || []).forEach((skill) => requiredAlongPath.add(skill));
  });

  return [...requiredAlongPath].filter((skill) => !currentSkills.has(skill));
}

export function getTimelineForPath(transitions, path) {
  if (path.length < 2) return { totalMonths: 0, segments: [] };

  const edgeMap = new Map(transitions.map((t) => [`${t.fromRoleId}->${t.toRoleId}`, t]));
  const segments = [];
  let totalMonths = 0;

  for (let i = 0; i < path.length - 1; i += 1) {
    const key = `${path[i]}->${path[i + 1]}`;
    const edge = edgeMap.get(key);
    if (edge) {
      totalMonths += edge.estimatedMonths;
      segments.push({
        fromRoleId: edge.fromRoleId,
        toRoleId: edge.toRoleId,
        estimatedMonths: edge.estimatedMonths,
        difficulty: edge.difficulty,
      });
    }
  }

  return { totalMonths, segments };
}
