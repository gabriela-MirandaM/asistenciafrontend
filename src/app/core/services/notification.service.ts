import { Injectable, signal, Signal } from '@angular/core';

import { Toast } from '../../models/toast.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private toasts = signal<Toast[]>([]);
  private idCounter = 0;

  getToasts(): Signal<Toast[]> {
    return this.toasts;
  }

  show(type: Toast['type'], message: string) {
    const id = this.idCounter++;
    this.toasts.update((prev) => [...prev, { id, type, message }]);
    setTimeout(() => this.dismiss(id), 5000);
  }

  dismiss(id: number) {
    this.toasts.update((prev) => prev.filter((toast) => toast.id !== id));
  }
}
