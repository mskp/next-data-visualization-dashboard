import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Histogram = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    data = data.filter((country) => country.trim() !== '');

    // Constants for histogram rendering
    const margin = { top: 20, right: 100, bottom: 70, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Prepare data for histogram
    const histogramData = data.reduce((acc, country) => {
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    // Convert histogram data to an array of objects
    const histogramArray = Object.entries(histogramData).map(([country, value]) => ({
      country,
      value,
    }));

    // Create a histogram generator
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    // Update scales with new data
    const countries = histogramArray.map((d) => d.country);
    x.domain(countries);
    y.domain([0, d3.max(histogramArray, (d) => d.value)]);

    svg
      .append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '1.5rem')
      .style("fill", "white")
      .text('Country');

    // Create and append bars
    svg
      .selectAll('.bar')
      .data(histogramArray)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.country))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => height - y(d.value))
      .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
      .text('Frequency');
    // Apply different colors to each bar


    // Add y-axis
    svg.append('g').call(d3.axisLeft(y));

    // Add legend
    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width + 10}, 0)`);

    const legendItems = legend
      .selectAll('.legend-item')
      .data(countries)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems
      .append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d, i) => d3.schemeCategory10[i % 10]);

    legendItems
      .append('text')
      .attr('x', 15)
      .attr('y', 9)
      .style('font-size', '6px') // Set the desired font size for the legend text
      .style("fill", "white")
      .text((d) => d);
  }, [data]);

  return (
    <div className="rounded-lg shadow-lg inline-block">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Histogram;
