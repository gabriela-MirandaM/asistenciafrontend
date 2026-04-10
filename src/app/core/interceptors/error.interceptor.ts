import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifier = inject(NotificationService);

  return next(req).pipe(
    catchError((err) => {
      // Los errores 401 (Unauthorized) son por que el token ha expirado o no es valido, SOLO en este caso no enviaremos mensaje.
      if (err?.status === 401) {
        return throwError(() => err);
      }
      notifier.show(
        'error',
        err?.error?.message || 'Ocurrió un error inesperado.'
      );
      return throwError(() => err);
    })
  );
};
