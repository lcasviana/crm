import { Route } from "@angular/router";

export const appRoutes: Route[] = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./dashboard/dashboard.component").then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: "leads",
    loadComponent: () =>
      import("./leads/leads.component").then((m) => m.LeadsComponent),
  },
  {
    path: "deals",
    loadComponent: () =>
      import("./deals/deals.component").then((m) => m.DealsComponent),
  },
];
