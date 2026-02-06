export function findShortestPath(transitions, fromRoleId, toRoleId) {
  const adjacency = new Map();
  transitions.forEach((transition) => {
    if (!adjacency.has(transition.fromRoleId)) adjacency.set(transition.fromRoleId, []);
    adjacency.get(transition.fromRoleId).push(transition.toRoleId);
  });

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
