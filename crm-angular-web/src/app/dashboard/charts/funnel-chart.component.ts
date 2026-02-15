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

import { Deal, DEAL_STAGE_LABELS, DealStage } from "../../shared/models/deal.model";

interface FunnelStage {
  stage: DealStage;
  label: string;
  count: number;
}

@Component({
  selector: "crm-funnel-chart",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-full w-full" #chartContainer></div>
  `,
})
export class FunnelChartComponent {
  deals = input.required<Deal[]>();
  chartContainer = viewChild.required<ElementRef<HTMLElement>>("chartContainer");

  private resizeObserver: ResizeObserver | undefined;

  constructor() {
    afterNextRender(() => {
      this.resizeObserver = new ResizeObserver(() => this.drawChart());
      this.resizeObserver.observe(this.chartContainer().nativeElement);
      this.drawChart();
    });

    effect(() => {
      this.deals();
      this.drawChart();
    });
  }

  private drawChart() {
    const element = this.chartContainer()?.nativeElement;
    if (!element) return;
    const deals = this.deals();

    d3.select(element).selectAll("*").remove();

    const pipelineStages: DealStage[] = [
      "Prospecting",
      "Proposal",
      "Negotiation",
      "ClosedWon",
    ];

    const stages: FunnelStage[] = pipelineStages.map((stage) => ({
      stage,
      label: DEAL_STAGE_LABELS[stage],
      count: deals.filter((d) => d.stage === stage).length,
    }));

    const rect = element.getBoundingClientRect();
    const margin = { top: 10, right: 20, bottom: 10, left: 20 };
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

    const maxCount = d3.max(stages, (d) => d.count) || 1;
    const segmentHeight = height / stages.length;
    const colors = ["#7c3aed", "#8b5cf6", "#a78bfa", "#10b981"];

    stages.forEach((stage, i) => {
      const topWidth = (width * (stages[i]?.count || 1)) / maxCount;
      const bottomWidth =
        i < stages.length - 1
          ? (width * (stages[i + 1]?.count || 1)) / maxCount
          : topWidth * 0.7;

      const y = i * segmentHeight;
      const topLeft = (width - topWidth) / 2;
      const topRight = (width + topWidth) / 2;
      const bottomLeft = (width - bottomWidth) / 2;
      const bottomRight = (width + bottomWidth) / 2;

      const path = `M ${topLeft} ${y}
        L ${topRight} ${y}
        L ${bottomRight} ${y + segmentHeight - 2}
        L ${bottomLeft} ${y + segmentHeight - 2} Z`;

      svg
        .append("path")
        .attr("d", path)
        .attr("fill", colors[i])
        .style("opacity", 0)
        .transition()
        .duration(400)
        .delay(i * 100)
        .style("opacity", 1);

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", y + segmentHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("class", "fill-white text-xs font-medium")
        .text(`${stage.label}: ${stage.count}`);
    });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }
}
