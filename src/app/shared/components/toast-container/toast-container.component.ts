import { Component, inject } from '@angular/core';

import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [],
  templateUrl: './toast-container.component.html',
})
export class ToastContainerComponent {
  private notificationService = inject(NotificationService);

  toasts = this.notificationService.getToasts();

  dismiss(id: number) {
    this.notificationService.dismiss(id);
  }

  getAlertClass(type: string) {
    return {
      'alert-success': type === 'success',
      'alert-error': type === 'error',
      'alert-info': type === 'info',
      'alert-warning': type === 'warning',
    };
  }
}
