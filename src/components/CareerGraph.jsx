import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

function CareerGraph({ dataset, search, trackFilter, recommendedPath }) {
  const svgRef = useRef(null);

  const graphData = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    const filteredRoles = dataset.roles.filter((role) => {
      const trackMatch = trackFilter === "all" || role.track === trackFilter;
      const searchMatch =
        searchLower.length === 0 ||
        role.name.toLowerCase().includes(searchLower) ||
        role.requiredSkills.some((skillId) => skillId.toLowerCase().includes(searchLower));
      return trackMatch && searchMatch;
    });

    const roleIds = new Set(filteredRoles.map((role) => role.id));
    const links = dataset.transitions
      .filter((transition) => roleIds.has(transition.fromRoleId) && roleIds.has(transition.toRoleId))
      .map((transition) => ({ source: transition.fromRoleId, target: transition.toRoleId, recommended: transition.recommended }));

    return { nodes: filteredRoles.map((role) => ({ ...role })), links };
  }, [dataset, search, trackFilter]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 620;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const root = svg.append("g");
    svg.call(d3.zoom().scaleExtent([0.2, 4]).on("zoom", (event) => root.attr("transform", event.transform)));

    const highlightedSegments = new Set(recommendedPath.slice(1).map((node, index) => `${recommendedPath[index]}->${node}`));

    const simulation = d3
      .forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id((d) => d.id).distance(140))
      .force("charge", d3.forceManyBody().strength(-350))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = root
      .append("g")
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke-width", 2)
      .attr("stroke", (d) => (highlightedSegments.has(`${d.source}->${d.target}`) ? "#ff6b35" : d.recommended ? "#5b8def" : "#999"));

    const node = root
      .append("g")
      .selectAll("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("r", 20)
      .attr("fill", (d) => (d.futureRole ? "#6c5ce7" : d.family === "management" ? "#00a896" : "#4d77ff"))
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded));

    const labels = root
      .append("g")
      .selectAll("text")
      .data(graphData.nodes)
      .join("text")
      .text((d) => d.name)
      .attr("font-size", 11)
      .attr("dx", 24)
      .attr("dy", 4);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    function dragStarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragEnded(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [graphData, recommendedPath]);

  return (
    <section className="graph-wrapper">
      <svg ref={svgRef} role="img" aria-label="Career graph visualization" />
    </section>
  );
}

export default CareerGraph;
