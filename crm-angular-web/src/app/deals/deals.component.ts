import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatTableModule } from "@angular/material/table";

import {
  Deal,
  DealRequest,
  DealStage,
  DEAL_STAGE_LABELS,
} from "../shared/models/deal.model";
import { DealsStore } from "./deals.store";
import {
  DealFormDialogComponent,
  DealFormDialogData,
} from "./deal-form-dialog.component";

@Component({
  selector: "crm-deals",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DealsStore],
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatTableModule,
  ],
  template: `
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Deals</h1>
        <p class="text-sm text-[var(--mat-sys-on-surface-variant)]">
          Track your sales pipeline
        </p>
      </div>
      <div class="flex items-center gap-3">
        <mat-button-toggle-group
          [value]="viewMode()"
          (change)="viewMode.set($event.value)"
          hideSingleSelectionIndicator
        >
          <mat-button-toggle value="kanban">
            <mat-icon>view_column</mat-icon>
          </mat-button-toggle>
          <mat-button-toggle value="table">
            <mat-icon>table_rows</mat-icon>
          </mat-button-toggle>
        </mat-button-toggle-group>
        <button mat-flat-button (click)="openForm()">
          <mat-icon>add</mat-icon>
          Add Deal
        </button>
      </div>
    </div>

    @if (store.loading()) {
      <mat-progress-bar mode="indeterminate" />
    }

    @if (viewMode() === "kanban") {
      <div class="flex gap-4 overflow-x-auto pb-4">
        @for (stage of store.stages(); track stage) {
          <div
            class="flex w-72 shrink-0 flex-col rounded-xl border border-[var(--mat-sys-outline-variant)] bg-[var(--mat-sys-surface-container-lowest)]"
          >
            <div
              class="flex items-center justify-between border-b border-[var(--mat-sys-outline-variant)] px-4 py-3"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold">{{
                  stageLabels[stage]
                }}</span>
                <span
                  class="rounded-full bg-[var(--mat-sys-secondary-container)] px-2 py-0.5 text-xs"
                >
                  {{ store.dealsByStage()[stage].length }}
                </span>
              </div>
              <button
                mat-icon-button
                class="!size-8 !leading-8"
                (click)="openForm(undefined, stage)"
              >
                <mat-icon class="!text-lg">add</mat-icon>
              </button>
            </div>
            <div class="flex flex-col gap-2 p-2">
              @for (deal of store.dealsByStage()[stage]; track deal.id) {
                <mat-card
                  class="cursor-pointer !rounded-lg"
                  (click)="openForm(deal)"
                  appearance="outlined"
                >
                  <mat-card-content class="!p-3">
                    <p class="text-sm font-medium">{{ deal.title }}</p>
                    <p class="text-lg font-semibold text-[var(--mat-sys-primary)]">
                      {{ deal.value | currency }}
                    </p>
                  </mat-card-content>
                </mat-card>
              } @empty {
                <p
                  class="py-4 text-center text-xs text-[var(--mat-sys-on-surface-variant)]"
                >
                  No deals
                </p>
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <div
        class="overflow-hidden rounded-xl border border-[var(--mat-sys-outline-variant)]"
      >
        <table mat-table [dataSource]="store.deals()" class="w-full">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let deal">{{ deal.title }}</td>
          </ng-container>
          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Value</th>
            <td mat-cell *matCellDef="let deal">
              {{ deal.value | currency }}
            </td>
          </ng-container>
          <ng-container matColumnDef="stage">
            <th mat-header-cell *matHeaderCellDef>Stage</th>
            <td mat-cell *matCellDef="let deal">
              <mat-chip highlighted>{{ getStageLabel(deal.stage) }}</mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="w-24">Actions</th>
            <td mat-cell *matCellDef="let deal">
              <button mat-icon-button (click)="openForm(deal)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteDeal(deal)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="tableColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: tableColumns"></tr>
        </table>
      </div>
    }
  `,
})
export class DealsComponent implements OnInit {
  store = inject(DealsStore);
  private dialog = inject(MatDialog);

  viewMode = signal<"kanban" | "table">("kanban");
  stageLabels = DEAL_STAGE_LABELS;
  tableColumns = ["title", "value", "stage", "actions"];

  ngOnInit() {
    this.store.loadDeals();
  }

  openForm(deal?: Deal, defaultStage?: DealStage) {
    const data: DealFormDialogData = {
      deal: deal ?? null,
      defaultStage,
    };
    const dialogRef = this.dialog.open(DealFormDialogComponent, {
      width: "480px",
      data,
    });

    dialogRef.afterClosed().subscribe((result: DealRequest | undefined) => {
      if (!result) return;
      if (deal) {
        this.store.updateDeal(deal.id, result);
      } else {
        this.store.createDeal(result);
      }
    });
  }

  deleteDeal(deal: Deal) {
    this.store.deleteDeal(deal.id);
  }

  getStageLabel(stage: string): string {
    return DEAL_STAGE_LABELS[stage as DealStage] ?? stage;
  }
}
