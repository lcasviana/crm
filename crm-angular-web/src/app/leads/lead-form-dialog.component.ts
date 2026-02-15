import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";

import {
  Lead,
  LeadRequest,
  LEAD_SOURCES,
  LEAD_STATUSES,
} from "../shared/models/lead.model";

@Component({
  selector: "crm-lead-form-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? "Edit Lead" : "New Lead" }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-2">
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field>
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" />
          </mat-form-field>
        </div>
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Source</mat-label>
          <mat-select formControlName="source">
            @for (source of sources; track source) {
              <mat-option [value]="source">{{ source }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            @for (status of statuses; track status) {
              <mat-option [value]="status">{{ status }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-flat-button
        color="primary"
        [disabled]="form.invalid"
        (click)="save()"
      >
        {{ data ? "Update" : "Create" }}
      </button>
    </mat-dialog-actions>
  `,
})
export class LeadFormDialogComponent {
  private dialogRef = inject(MatDialogRef<LeadFormDialogComponent>);
  data = inject<Lead | null>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  statuses = LEAD_STATUSES;
  sources = LEAD_SOURCES;

  form = this.fb.nonNullable.group({
    firstName: [this.data?.firstName ?? "", [Validators.required, Validators.maxLength(100)]],
    lastName: [this.data?.lastName ?? "", [Validators.required, Validators.maxLength(100)]],
    email: [this.data?.email ?? "", [Validators.required, Validators.email]],
    phone: [this.data?.phone ?? ""],
    source: [this.data?.source ?? ""],
    status: [this.data?.status ?? "New"],
  });

  save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const request: LeadRequest = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      phone: value.phone || null,
      source: value.source || null,
      status: value.status as LeadRequest["status"],
    };
    this.dialogRef.close(request);
  }
}
