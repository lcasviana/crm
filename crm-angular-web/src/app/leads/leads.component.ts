import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { Lead, LeadRequest, LeadStatus } from "../shared/models/lead.model";
import { LeadsStore } from "./leads.store";
import { LeadFormDialogComponent } from "./lead-form-dialog.component";

@Component({
  selector: "crm-leads",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LeadsStore],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Leads</h1>
        <p class="text-sm text-[var(--mat-sys-on-surface-variant)]">
          Manage your sales leads
        </p>
      </div>
      <button mat-flat-button (click)="openForm()">
        <mat-icon>add</mat-icon>
        Add Lead
      </button>
    </div>

    @if (store.loading()) {
      <mat-progress-bar mode="indeterminate" />
    }

    <div
      class="overflow-hidden rounded-xl border border-[var(--mat-sys-outline-variant)]"
    >
      <table mat-table [dataSource]="store.leads()" class="w-full">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let lead">
            {{ lead.firstName }} {{ lead.lastName }}
          </td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let lead">{{ lead.email }}</td>
        </ng-container>

        <ng-container matColumnDef="phone">
          <th mat-header-cell *matHeaderCellDef>Phone</th>
          <td mat-cell *matCellDef="let lead">{{ lead.phone ?? "—" }}</td>
        </ng-container>

        <ng-container matColumnDef="source">
          <th mat-header-cell *matHeaderCellDef>Source</th>
          <td mat-cell *matCellDef="let lead">{{ lead.source ?? "—" }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let lead">
            <mat-chip [class]="statusClass(lead.status)" highlighted>
              {{ lead.status }}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="w-24">Actions</th>
          <td mat-cell *matCellDef="let lead">
            <button mat-icon-button (click)="openForm(lead)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button (click)="deleteLead(lead)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <mat-paginator
        [length]="store.totalCount()"
        [pageSize]="store.pageSize()"
        [pageIndex]="store.page() - 1"
        [pageSizeOptions]="[5, 10, 25]"
        (page)="onPage($event)"
        showFirstLastButtons
      />
    </div>
  `,
})
export class LeadsComponent implements OnInit {
  store = inject(LeadsStore);
  private dialog = inject(MatDialog);

  displayedColumns = ["name", "email", "phone", "source", "status", "actions"];

  ngOnInit() {
    this.store.loadLeads();
  }

  onPage(event: PageEvent) {
    this.store.loadLeads(event.pageIndex + 1, event.pageSize);
  }

  openForm(lead?: Lead) {
    const dialogRef = this.dialog.open(LeadFormDialogComponent, {
      width: "480px",
      data: lead ?? null,
    });

    dialogRef.afterClosed().subscribe((result: LeadRequest | undefined) => {
      if (!result) return;
      if (lead) {
        this.store.updateLead(lead.id, result);
      } else {
        this.store.createLead(result);
      }
    });
  }

  deleteLead(lead: Lead) {
    this.store.deleteLead(lead.id);
  }

  statusClass(status: LeadStatus): string {
    const map: Record<LeadStatus, string> = {
      New: "!bg-blue-100 !text-blue-800",
      Contacted: "!bg-amber-100 !text-amber-800",
      Qualified: "!bg-green-100 !text-green-800",
      Lost: "!bg-red-100 !text-red-800",
    };
    return map[status] ?? "";
  }
}
