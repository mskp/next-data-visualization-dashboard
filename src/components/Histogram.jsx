import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Histogram = ({ data, title }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const container = svg.node().closest('div');
    const containerWidth = container.clientWidth;
    const containerHeight = containerWidth * 0.6; // Maintain an aspect ratio
    const margin = { top: 40, right: 30, bottom: 70, left: 70 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain(d3.extent(data)).range([0, width]);

    const bins = d3.histogram().domain(x.domain()).thresholds(x.ticks(20))(data);

    const y = d3
      .scaleLinear()
      .domain([0, Math.min(1000, d3.max(bins, (d) => d.length))])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.selectAll('*').remove();

    svg
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.x0) + 1)
      .attr('width', (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
      .attr('y', (d) => y(d.length))
      .attr('height', (d) => y(0) - y(d.length))
      .attr('fill', 'steelblue');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .style('text-anchor', 'end');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    // Add titles
    svg
      .append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '1.5rem')
      .style('fill', 'white')
      .text(title);

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', margin.left / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', 'white')
      .text('Frequency');
  }, [data, title]);

  return (
    <div className="p-4 rounded-lg shadow-lg max-w">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Histogram;
