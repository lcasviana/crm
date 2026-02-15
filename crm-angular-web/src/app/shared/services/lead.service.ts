import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map } from "rxjs";

import { environment } from "../../../envs/env";
import {
  ApiResponse,
  PagedResult,
} from "../models/api-response.model";
import { Lead, LeadRequest } from "../models/lead.model";

@Injectable({ providedIn: "root" })
export class LeadService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/leads`;

  getAll(page = 1, pageSize = 10) {
    const params = new HttpParams()
      .set("page", page)
      .set("pageSize", pageSize);
    return this.http
      .get<ApiResponse<PagedResult<Lead>>>(this.baseUrl, { params })
      .pipe(map((res) => res.data!));
  }

  getById(id: string) {
    return this.http
      .get<ApiResponse<Lead>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data!));
  }

  create(request: LeadRequest) {
    return this.http
      .post<ApiResponse<Lead>>(this.baseUrl, request)
      .pipe(map((res) => res.data!));
  }

  update(id: string, request: LeadRequest) {
    return this.http
      .put<ApiResponse<Lead>>(`${this.baseUrl}/${id}`, request)
      .pipe(map((res) => res.data!));
  }

  delete(id: string) {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data!));
  }
}
