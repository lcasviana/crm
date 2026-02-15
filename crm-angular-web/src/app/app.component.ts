import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "crm-app",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  host: { class: "block size-full" },
  template: `
    <mat-sidenav-container class="size-full">
      <mat-sidenav
        [mode]="'side'"
        [opened]="sidenavOpen()"
        class="w-60 border-r border-[var(--mat-sys-outline-variant)]"
      >
        <div class="flex h-16 items-center gap-2 px-4">
          <mat-icon class="text-[var(--mat-sys-primary)]">hub</mat-icon>
          <span class="text-lg font-semibold">CRM</span>
        </div>
        <mat-nav-list>
          @for (link of navLinks; track link.path) {
            <a
              mat-list-item
              [routerLink]="link.path"
              routerLinkActive="!bg-[var(--mat-sys-secondary-container)]"
            >
              <mat-icon matListItemIcon>{{ link.icon }}</mat-icon>
              <span matListItemTitle>{{ link.label }}</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="border-b border-[var(--mat-sys-outline-variant)]">
          <button mat-icon-button (click)="sidenavOpen.set(!sidenavOpen())">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="ml-2 text-base font-medium">CRM Dashboard</span>
        </mat-toolbar>
        <main class="p-6">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class App {
  sidenavOpen = signal(true);

  navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { path: "/leads", label: "Leads", icon: "people" },
    { path: "/deals", label: "Deals", icon: "handshake" },
  ];
}
