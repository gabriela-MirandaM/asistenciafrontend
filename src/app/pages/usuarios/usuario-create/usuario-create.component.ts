import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { User } from '../../../models/user.interface';
import { UserService } from '../../../core/services/user.service';
import { UsuarioFormComponent } from '../usuario-form/usuario-form.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-usuario-create',
  imports: [UsuarioFormComponent, RouterLink],
  templateUrl: './usuario-create.component.html',
})
export class UsuarioCreateComponent {
  constructor(private userService: UserService, private router: Router, private notificationService: NotificationService) {}

  createUser(data: Partial<User>) {
    this.userService.createUser(data).subscribe(
      {
        next: () => {
          this.notificationService.show(
            'success',
            'Usuario creado correctamente'
          ),
          this.router.navigate(['/usuarios']);
          return;
        },
      }
      //   () => {
      //   this.router.navigate(['/usuarios']);
      // }
    );
  }
}
