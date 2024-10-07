import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
  historicalData: { date: string; price: number }[];
  showTooltip?: boolean;
  showAxes?: boolean;
  miniChart?: boolean;
}

const PriceChart: React.FC<Props> = ({
  historicalData,
  showTooltip = true,
  showAxes = true,
  miniChart = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (historicalData.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = miniChart ? 128 : 750;
    const height = miniChart ? 64 : 400;

    // Increase left margin to accommodate larger numbers
    const margin = miniChart
      ? { top: 2, right: 2, bottom: 2, left: 2 }
      : { top: 20, right: 30, bottom: 30, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Parse dates and create scales
    const parseDate = d3.timeParse("%Y-%m-%d");
    const xScale = d3
      .scaleTime()
      .domain(
        d3.extent(historicalData, (d) => parseDate(d.date) as Date) as [
          Date,
          Date
        ]
      )
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(historicalData, (d) => d.price) as number,
        d3.max(historicalData, (d) => d.price) as number,
      ])
      .range([innerHeight, 0])
      .nice();

    // Create line generator
    const line = d3
      .line<{ date: string; price: number }>()
      .x((d) => xScale(parseDate(d.date) as Date))
      .y((d) => yScale(d.price));

    // Clear previous content
    svg.selectAll("*").remove();

    // Create chart group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add axes only if showAxes is true and it's not a mini chart
    if (showAxes && !miniChart) {
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

      g.append("g").call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => d3.format(",.0f")(d))
      );
    }

    // Add the line path
    g.append("path")
      .datum(historicalData)
      .attr("fill", "none")
      .attr("stroke", "#00c805")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Create tooltip only if showTooltip is true and it's not a mini chart
    if (showTooltip && !miniChart) {
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ddd")
        .style("padding", "10px");

      // Create a rect for mouse tracking only if showTooltip is true and it's not a mini chart
      const mouseArea = g
        .append("rect")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .attr("fill", "none")
        .attr("pointer-events", "all");

      // Add mouse events only if showTooltip is true and it's not a mini chart
      mouseArea
        .on("mousemove", function (event) {
          const [xPos] = d3.pointer(event, this);
          const x0 = xScale.invert(xPos);
          const bisect = d3.bisector(
            (d: { date: string }) => parseDate(d.date) as Date
          ).left;
          const index = bisect(historicalData, x0, 1);
          const d0 = historicalData[index - 1];
          const d1 = historicalData[index];
          const d =
            x0.getTime() - parseDate(d0.date)!.getTime() >
            parseDate(d1.date)!.getTime() - x0.getTime()
              ? d1
              : d0;

          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(`Date: ${d.date}<br/>Price: $${d.price}`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    }

    // Cleanup function
    return () => {
      if (showTooltip && !miniChart) {
        d3.select("body").select(".tooltip").remove();
      }
    };
  }, [historicalData, showTooltip, showAxes, miniChart]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${miniChart ? 128 : 800} ${miniChart ? 64 : 400}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );
};

export default PriceChart;
