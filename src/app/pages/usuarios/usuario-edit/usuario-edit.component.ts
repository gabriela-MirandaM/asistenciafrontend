import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { User } from '../../../models/user.interface';
import { UserService } from '../../../core/services/user.service';
import { UsuarioFormComponent } from '../usuario-form/usuario-form.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-usuario-edit',
  imports: [UsuarioFormComponent, RouterLink],
  templateUrl: './usuario-edit.component.html',
})
export class UsuarioEditComponent {
  user = signal<User | undefined>(undefined);

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getUserById(id).subscribe((res) => this.user.set(res));
    }
  }

  updateUser(data: Partial<User>) {
    const id = this.user()?.id;
    if (id) {
      this.userService.updateUser(id, data).subscribe(
        {
          next: () => {
            this.notificationService.show(
              'success',
              'Usuario actualizado correctamente'
            ),
              this.router.navigate(['/usuarios']);
            return;
          },
        }
        // () => {
        //   this.router.navigate(['/usuarios']);
        // }
      );
    }
  }
}
