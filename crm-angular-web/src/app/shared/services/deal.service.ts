import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map } from "rxjs";

import { environment } from "../../../envs/env";
import {
  ApiResponse,
  PagedResult,
} from "../models/api-response.model";
import { Deal, DealRequest } from "../models/deal.model";

@Injectable({ providedIn: "root" })
export class DealService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/deals`;

  getAll(page = 1, pageSize = 100) {
    const params = new HttpParams()
      .set("page", page)
      .set("pageSize", pageSize);
    return this.http
      .get<ApiResponse<PagedResult<Deal>>>(this.baseUrl, { params })
      .pipe(map((res) => res.data!));
  }

  getById(id: string) {
    return this.http
      .get<ApiResponse<Deal>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data!));
  }

  create(request: DealRequest) {
    return this.http
      .post<ApiResponse<Deal>>(this.baseUrl, request)
      .pipe(map((res) => res.data!));
  }

  update(id: string, request: DealRequest) {
    return this.http
      .put<ApiResponse<Deal>>(`${this.baseUrl}/${id}`, request)
      .pipe(map((res) => res.data!));
  }

  delete(id: string) {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data!));
  }
}
