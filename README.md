# Career Path Visualization Platform (React + D3)

## Is this complete?
This is now a **working frontend scaffold** with core features and an extensible architecture. It is production-oriented, but still a base to evolve (e.g., schema validation in CI, worker-based path computation, large-graph rendering mode).

## How to test locally

### Prerequisites
- Node.js 20+
- npm 10+

### Run locally
```bash
npm install
npm run dev
```
Then open: `http://localhost:5173`

### Build check
```bash
npm run build
npm run preview
```
Then open: `http://localhost:4173`

### What to verify manually
1. Select a **current role** and **target role**.
2. Confirm a **recommended path** appears (role names, not IDs).
3. Confirm **top 3 path comparisons** are shown when multiple paths exist.
4. Confirm **timeline estimate** updates with selected route.
5. Confirm **missing skills** list updates.
6. Use mouse wheel + drag to verify graph **zoom/pan**.
7. Use **search** and **track filter** to verify node filtering.

## System Design

### 1) Frontend-only architecture
- **Presentation layer**: React functional components (`src/components`) and app composition (`src/App.jsx`).
- **Visualization layer**: D3 force-directed graph renderer in `CareerGraph` for nodes (roles) and edges (transitions).
- **Domain logic layer**: Path, comparison, skill-gap, and timeline algorithms in `src/utils/pathing.js`.
- **Data access layer**: Lazy JSON dataset loading through dynamic imports in `src/services/dataLoader.js`.
- **Data layer**: Versioned JSON files under `data/datasets/v1`, validated against schema in `data/schemas`.

### 2) Data model goals
- No hardcoded role graph in components.
- Additions for roles/skills/tracks happen in JSON only.
- Versioning (`meta.version`) allows dataset upgrades without breaking older clients.

### 3) Graph behavior
- Nodes represent roles.
- Edges represent transitions.
- Zoom and pan powered by D3 zoom behavior.
- Filters for track and search prune graph in-memory.
- Recommended path highlighting overlays selected route edges.

### 4) UX features in this sample
- Select current role and target role.
- Compute top path options, show recommended shortest path.
- Show missing skills from role requirements along selected path.
- Show timeline estimate (months) from transition metadata.
- Search and track filtering.

## Folder Structure

```text
.
├── data
│   ├── datasets
│   │   └── v1
│   │       └── core-careers.json
│   └── schemas
│       └── career-graph.schema.json
├── src
│   ├── components
│   │   ├── CareerGraph.jsx
│   │   └── ControlPanel.jsx
│   ├── hooks
│   │   └── useCareerData.js
│   ├── services
│   │   └── dataLoader.js
│   ├── styles
│   │   └── app.css
│   ├── utils
│   │   └── pathing.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## JSON Schema Example
See `data/schemas/career-graph.schema.json`.

Schema supports:
- Skills (including prerequisites and timelines)
- Roles (levels, track, future roles, certifications)
- Transitions (difficulty, duration, path type)
- Certifications
- Multiple tracks (engineering, management, AI, industry-specific)

## How to extend (JSON only)
1. Add new skills to `skills`.
2. Add roles and required skills to `roles`.
3. Add transitions to `transitions`.
4. Add new tracks and certifications as needed.
5. Optional: create a new version directory (`datasets/v2`) and switch dataset name.

No component code changes are required when adding roles, skills, or transitions following schema.

## Scaling strategy for large datasets
1. **Data chunking**: Split datasets by domain/industry and lazy-load on demand.
2. **Web worker algorithms**: Move path search and multi-path comparison to workers.
3. **Graph virtualization**: Cluster high-degree nodes and progressively disclose child subgraphs.
4. **Indexing**: Build precomputed adjacency and skill-role reverse indices during load.
5. **Caching**: Persist parsed JSON in IndexedDB/localStorage with dataset version keys.
6. **Rendering optimization**: Move edges to Canvas/WebGL layer while keeping React UI for controls.
7. **Governance**: Enforce schema validation in CI before release of new JSON packs.

## Future AI-driven extensions
- Add role recommendation engine powered by client-side models or external inference API (optional later).
- Track confidence scores per transition and skill transferability metadata.
- Introduce scenario simulation (timeline vs effort vs certification cost).
