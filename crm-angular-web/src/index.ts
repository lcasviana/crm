import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideZonelessChangeDetection } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";

import { App } from "./app/app.component";
import { appRoutes } from "./app/app.routes";
import { errorInterceptor } from "./app/shared/interceptors/error.interceptor";

bootstrapApplication(App, {
  providers: [
    provideRouter(appRoutes),
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([errorInterceptor])),
  ],
}).catch(console.error);
