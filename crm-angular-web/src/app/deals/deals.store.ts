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
import {
  Deal,
  DealRequest,
  DealStage,
  DEAL_STAGES,
} from "../shared/models/deal.model";
import { DealService } from "../shared/services/deal.service";

interface DealsState {
  pagedResult: PagedResult<Deal> | null;
  loading: boolean;
  error: string | null;
}

const initialState: DealsState = {
  pagedResult: null,
  loading: false,
  error: null,
};

export const DealsStore = signalStore(
  withState(initialState),
  withComputed((state) => ({
    deals: computed(() => state.pagedResult()?.items ?? []),
    dealsByStage: computed(() => {
      const deals = state.pagedResult()?.items ?? [];
      const grouped: Record<DealStage, Deal[]> = {
        Prospecting: [],
        Proposal: [],
        Negotiation: [],
        ClosedWon: [],
        ClosedLost: [],
      };
      for (const deal of deals) {
        grouped[deal.stage].push(deal);
      }
      return grouped;
    }),
    stages: computed(() => DEAL_STAGES),
  })),
  withMethods((store, dealService = inject(DealService)) => ({
    async loadDeals() {
      patchState(store, { loading: true, error: null });
      try {
        const pagedResult = await firstValueFrom(
          dealService.getAll(1, 100),
        );
        patchState(store, { pagedResult, loading: false });
      } catch (e) {
        patchState(store, {
          error: (e as Error).message,
          loading: false,
        });
      }
    },
    async createDeal(request: DealRequest) {
      patchState(store, { loading: true, error: null });
      try {
        await firstValueFrom(dealService.create(request));
        patchState(store, { loading: false });
        await this.loadDeals();
      } catch (e) {
        patchState(store, {
          error: (e as Error).message,
          loading: false,
        });
      }
    },
    async updateDeal(id: string, request: DealRequest) {
      patchState(store, { loading: true, error: null });
      try {
        await firstValueFrom(dealService.update(id, request));
        patchState(store, { loading: false });
        await this.loadDeals();
      } catch (e) {
        patchState(store, {
          error: (e as Error).message,
          loading: false,
        });
      }
    },
    async deleteDeal(id: string) {
      patchState(store, { loading: true, error: null });
      try {
        await firstValueFrom(dealService.delete(id));
        patchState(store, { loading: false });
        await this.loadDeals();
      } catch (e) {
        patchState(store, {
          error: (e as Error).message,
          loading: false,
        });
      }
    },
  })),
);
