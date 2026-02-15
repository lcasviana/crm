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
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";

import {
  Deal,
  DealRequest,
  DealStage,
  DEAL_STAGES,
  DEAL_STAGE_LABELS,
} from "../shared/models/deal.model";

export interface DealFormDialogData {
  deal: Deal | null;
  defaultStage?: DealStage;
  leadId?: string;
}

@Component({
  selector: "crm-deal-form-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.deal ? "Edit Deal" : "New Deal" }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-2">
        <mat-form-field>
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Value</mat-label>
          <span matTextPrefix>$&nbsp;</span>
          <input matInput formControlName="value" type="number" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Close Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="closeDate" />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Stage</mat-label>
          <mat-select formControlName="stage">
            @for (stage of stages; track stage) {
              <mat-option [value]="stage">{{ stageLabels[stage] }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Lead ID</mat-label>
          <input matInput formControlName="leadId" />
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
        {{ data.deal ? "Update" : "Create" }}
      </button>
    </mat-dialog-actions>
  `,
})
export class DealFormDialogComponent {
  private dialogRef = inject(MatDialogRef<DealFormDialogComponent>);
  data = inject<DealFormDialogData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  stages = DEAL_STAGES;
  stageLabels = DEAL_STAGE_LABELS;

  form = this.fb.nonNullable.group({
    title: [this.data.deal?.title ?? "", [Validators.required, Validators.maxLength(200)]],
    value: [this.data.deal?.value ?? 0, [Validators.required, Validators.min(0)]],
    closeDate: [
      this.data.deal?.closeDate ? new Date(this.data.deal.closeDate) : null as Date | null,
    ],
    stage: [
      this.data.deal?.stage ?? this.data.defaultStage ?? "Prospecting",
      [Validators.required],
    ],
    leadId: [this.data.deal?.leadId ?? this.data.leadId ?? "", [Validators.required]],
  });

  save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const request: DealRequest = {
      title: value.title,
      value: value.value,
      closeDate: value.closeDate ? value.closeDate.toISOString() : null,
      stage: value.stage as DealStage,
      leadId: value.leadId,
    };
    this.dialogRef.close(request);
  }
}
