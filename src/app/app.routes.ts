import { Routes } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuariosListComponent } from './pages/usuarios/usuarios-list/usuarios-list.component';
import { UsuarioCreateComponent } from './pages/usuarios/usuario-create/usuario-create.component';
import { UsuarioEditComponent } from './pages/usuarios/usuario-edit/usuario-edit.component';
import { RolesListComponent } from './pages/roles/roles-list/roles-list.component';
import { RoleCreateComponent } from './pages/roles/role-create/role-create.component';
import { RoleEditComponent } from './pages/roles/role-edit/role-edit.component';
import { AsistenciaListComponent } from './pages/asistencia/asistencia-list.component/asistencia-list.component';
import { CentrosEscolaresListComponent } from './pages/centros-escolares/centros-escolares-list.component/centros-escolares-list.component';
import { CentrosEscolaresGruposListComponent } from './pages/centros-escolares/centros-escolares-grupos-list.component/centros-escolares-grupos-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios', component: UsuariosListComponent, data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios/create', component: UsuarioCreateComponent, data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios/edit/:id', component: UsuarioEditComponent, data: { roles: ['ADMINISTRADOR'] } },
      { path: 'roles', component: RolesListComponent, data: { roles: ['ADMINISTRADOR'] } },
      { path: 'roles/create', component: RoleCreateComponent, data: { roles: ['ADMINISTRADOR'] } },
      { path: 'roles/edit/:id', component: RoleEditComponent, data: { roles: ['ADMINISTRADOR'] } },
      { path: 'asistencia', component: AsistenciaListComponent, data: { roles: ['ADMINISTRADOR', 'PROFESOR'] } },
      { path: 'centros-escolares', component: CentrosEscolaresListComponent, data: { roles: ['ADMINISTRADOR', 'SUPERVISOR'] } },
      { path: 'centros-escolares/:id/grupos', component: CentrosEscolaresGruposListComponent, data: { roles: ['ADMINISTRADOR', 'SUPERVISOR'] } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
  },
  { path: '**', redirectTo: '' },
];
