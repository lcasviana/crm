import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = "An unexpected error occurred";

      if (error.status === 0) {
        message = "Unable to connect to the server";
      } else if (error.error?.errors?.length) {
        message = error.error.errors.join(", ");
      } else if (error.status === 404) {
        message = "Resource not found";
      } else if (error.status >= 500) {
        message = "Server error. Please try again later.";
      }

      console.error(`[API Error] ${req.method} ${req.url}:`, message);
      return throwError(() => new Error(message));
    }),
  );
};
