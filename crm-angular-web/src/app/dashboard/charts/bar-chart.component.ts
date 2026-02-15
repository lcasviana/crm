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

import { MonthlyDealVolume } from "../../shared/models/dashboard.model";

@Component({
  selector: "crm-bar-chart",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-full w-full" #chartContainer></div>
  `,
})
export class BarChartComponent {
  data = input.required<MonthlyDealVolume[]>();
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
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = rect.width - margin.left - margin.right;
    const height = rect.height - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) return;

    const svg = d3
      .select(element)
      .append("svg")
      .attr("width", rect.width)
      .attr("height", rect.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.revenue) ?? 0])
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("class", "fill-[var(--mat-sys-on-surface-variant)] text-xs");

    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `$${d3.format(".2s")(d as number)}`),
      )
      .selectAll("text")
      .attr("class", "fill-[var(--mat-sys-on-surface-variant)] text-xs");

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "fill-[var(--mat-sys-primary)]")
      .attr("x", (d) => x(d.month)!)
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("rx", 4)
      .transition()
      .duration(600)
      .attr("y", (d) => y(d.revenue))
      .attr("height", (d) => height - y(d.revenue));
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }
}
