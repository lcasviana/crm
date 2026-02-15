import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
} from "@angular/core";
import * as d3 from "d3";

import { LeadSourceDistribution } from "../../shared/models/dashboard.model";

@Component({
  selector: "crm-donut-chart",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full w-full items-center justify-center" #chartContainer></div>
  `,
})
export class DonutChartComponent {
  data = input.required<LeadSourceDistribution[]>();
  chartContainer = viewChild.required<ElementRef<HTMLElement>>("chartContainer");

  private resizeObserver: ResizeObserver | undefined;

  constructor() {
    afterNextRender(() => {
      this.resizeObserver = new ResizeObserver(() => this.drawChart());
      this.resizeObserver.observe(this.chartContainer().nativeElement);
      this.drawChart();
    });

    effect(() => {
      this.data();
      this.drawChart();
    });
  }

  private drawChart() {
    const element = this.chartContainer()?.nativeElement;
    if (!element) return;
    const data = this.data();
    if (!data.length) return;

    d3.select(element).selectAll("*").remove();

    const rect = element.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const radius = size / 2 - 10;

    if (radius <= 0) return;

    const colors = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.source))
      .range(["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626", "#6b7280"]);

    const svg = d3
      .select(element)
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${size / 2},${size / 2})`);

    const pie = d3
      .pie<LeadSourceDistribution>()
      .value((d) => d.count)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<LeadSourceDistribution>>()
      .innerRadius(radius * 0.55)
      .outerRadius(radius);

    const total = d3.sum(data, (d) => d.count);

    const slices = svg
      .selectAll(".slice")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "slice");

    slices
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colors(d.data.source))
      .attr("stroke", "var(--mat-sys-surface)")
      .attr("stroke-width", 2)
      .style("opacity", 0)
      .transition()
      .duration(600)
      .style("opacity", 1);

    // Legend
    const legend = d3
      .select(element)
      .append("div")
      .attr("class", "ml-4 flex flex-col gap-1.5");

    data.forEach((d) => {
      const pct = total > 0 ? ((d.count / total) * 100).toFixed(0) : "0";
      const item = legend.append("div").attr("class", "flex items-center gap-2 text-xs");
      item
        .append("span")
        .attr("class", "inline-block size-2.5 rounded-full")
        .style("background-color", colors(d.source));
      item.append("span").text(`${d.source} (${pct}%)`);
    });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }
}
