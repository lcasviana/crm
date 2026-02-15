import { provideZonelessChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";

import { App } from "./app/app.component";
import { appRoutes } from "./app/app.routes";

bootstrapApplication(App, {
  providers: [provideRouter(appRoutes), provideZonelessChangeDetection()],
}).catch(console.error);
