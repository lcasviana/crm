import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map } from "rxjs";

import { environment } from "../../../envs/env";
import { ApiResponse } from "../models/api-response.model";
import { DashboardStats } from "../models/dashboard.model";

@Injectable({ providedIn: "root" })
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/dashboard`;

  getStats() {
    return this.http
      .get<ApiResponse<DashboardStats>>(`${this.baseUrl}/stats`)
      .pipe(map((res) => res.data!));
  }
}
