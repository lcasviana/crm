import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CurrencyPipe, DecimalPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { DashboardStats } from "../shared/models/dashboard.model";
import { Deal } from "../shared/models/deal.model";
import { DashboardService } from "../shared/services/dashboard.service";
import { DealService } from "../shared/services/deal.service";
import { BarChartComponent } from "./charts/bar-chart.component";
import { DonutChartComponent } from "./charts/donut-chart.component";
import { FunnelChartComponent } from "./charts/funnel-chart.component";

@Component({
  selector: "crm-dashboard",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    BarChartComponent,
    DonutChartComponent,
    FunnelChartComponent,
  ],
  template: `
    @if (loading()) {
      <mat-progress-bar mode="indeterminate" />
    }

    <!-- KPI Cards -->
    <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <mat-card appearance="outlined" class="!rounded-xl">
        <mat-card-content class="!p-5">
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-700"
            >
              <mat-icon>attach_money</mat-icon>
            </div>
            <div>
              <p class="text-sm text-[var(--mat-sys-on-surface-variant)]">
                Total Revenue
              </p>
              <p class="text-2xl font-bold">
                {{ stats()?.totalRevenue | currency : "USD" : "symbol" : "1.0-0" }}
              </p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined" class="!rounded-xl">
        <mat-card-content class="!p-5">
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700"
            >
              <mat-icon>trending_up</mat-icon>
            </div>
            <div>
              <p class="text-sm text-[var(--mat-sys-on-surface-variant)]">
                Conversion Rate
              </p>
              <p class="text-2xl font-bold">
                {{ stats()?.conversionRate | number : "1.1-1" }}%
              </p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined" class="!rounded-xl">
        <mat-card-content class="!p-5">
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700"
            >
              <mat-icon>handshake</mat-icon>
            </div>
            <div>
              <p class="text-sm text-[var(--mat-sys-on-surface-variant)]">
                Active Deals
              </p>
              <p class="text-2xl font-bold">{{ deals().length }}</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <mat-card appearance="outlined" class="!rounded-xl">
        <mat-card-header>
          <mat-card-title>Monthly Deal Volume</mat-card-title>
        </mat-card-header>
        <mat-card-content class="h-72">
          @if (stats(); as s) {
            <crm-bar-chart [data]="s.monthlyDealVolumes" />
          }
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined" class="!rounded-xl">
        <mat-card-header>
          <mat-card-title>Lead Source Distribution</mat-card-title>
        </mat-card-header>
        <mat-card-content class="h-72">
          @if (stats(); as s) {
            <crm-donut-chart [data]="s.leadSourceDistributions" />
          }
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined" class="col-span-full !rounded-xl">
        <mat-card-header>
          <mat-card-title>Sales Pipeline</mat-card-title>
        </mat-card-header>
        <mat-card-content class="h-72">
          @if (deals().length) {
            <crm-funnel-chart [deals]="deals()" />
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private dealService = inject(DealService);

  stats = signal<DashboardStats | null>(null);
  deals = signal<Deal[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.dealService.getAll(1, 100).subscribe({
      next: (result) => this.deals.set(result.items),
    });
  }
}
