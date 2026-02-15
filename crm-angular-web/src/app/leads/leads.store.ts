import { computed, inject } from "@angular/core";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { firstValueFrom } from "rxjs";

import { PagedResult } from "../shared/models/api-response.model";
import { Lead, LeadRequest } from "../shared/models/lead.model";
import { LeadService } from "../shared/services/lead.service";

interface LeadsState {
  pagedResult: PagedResult<Lead> | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
}

const initialState: LeadsState = {
  pagedResult: null,
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
};

export const LeadsStore = signalStore(
  withState(initialState),
  withComputed((state) => ({
    leads: computed(() => state.pagedResult()?.items ?? []),
    totalCount: computed(() => state.pagedResult()?.totalCount ?? 0),
  })),
  withMethods((store, leadService = inject(LeadService)) => ({
    async loadLeads(page?: number, pageSize?: number) {
      const p = page ?? store.page();
      const ps = pageSize ?? store.pageSize();
      patchState(store, { loading: true, error: null, page: p, pageSize: ps });
      try {
        const pagedResult = await firstValueFrom(leadService.getAll(p, ps));
        patchState(store, { pagedResult, loading: false });
      } catch (e) {
        patchState(store, {
          error: (e as Error).message,
          loading: false,
        });
      }
    },
    async createLead(request: LeadRequest) {
      patchState(store, { loading: true, error: null });
      try {
        await firstValueFrom(leadService.create(request));
        patchState(store, { loading: false });
        await this.loadLeads();
      } catch (e) {
        patchState(store, {
          error: (e as Error).message,
          loading: false,
        });
      }
    },
    async updateLead(id: string, request: LeadRequest) {
      patchState(store, { loading: true, error: null });
      try {
        await firstValueFrom(leadService.update(id, request));
        patchState(store, { loading: false });
        await this.loadLeads();
      } catch (e) {
        patchState(store, {
          error: (e as Error).message,
          loading: false,
        });
      }
    },
    async deleteLead(id: string) {
      patchState(store, { loading: true, error: null });
      try {
        await firstValueFrom(leadService.delete(id));
        patchState(store, { loading: false });
        await this.loadLeads();
      } catch (e) {
        patchState(store, {
          error: (e as Error).message,
          loading: false,
        });
      }
    },
  })),
);
