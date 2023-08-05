import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Histogram = ({ data, title }) => {
  const svgRef = useRef(null);
  data.sort((a, b) => a - b);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const container = svg.node().closest('div');
    const containerWidth = container.clientWidth;
    const containerHeight = containerWidth * 0.6;
    const margin = { top: 40, right: 30, bottom: 40, left: 40 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const x = d3.scaleBand().domain(data).range([0, width]).padding(0.1);

    const frequencies = data.reduce((acc, d) => {
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});

    const y = d3
      .scaleLinear()
      .domain([0, Math.min(1000, d3.max(Object.values(frequencies)))])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.selectAll('*').remove();

    svg
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(frequencies[d]))
      .attr('height', (d) => y(0) - y(frequencies[d]))
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

    svg
      .append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '1.5rem')
      .style('fill', 'white')
      .text(title);

  }, [data]);

  return (
    <div className="p-4 rounded-lg shadow-lg min-h-64">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Histogram;
