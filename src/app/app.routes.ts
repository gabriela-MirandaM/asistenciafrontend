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
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosListComponent },
      { path: 'usuarios/create', component: UsuarioCreateComponent },
      { path: 'usuarios/edit/:id', component: UsuarioEditComponent },
      { path: 'roles', component: RolesListComponent },
      { path: 'roles/create', component: RoleCreateComponent },
      { path: 'roles/edit/:id', component: RoleEditComponent },
      { path: 'asistencia', component: AsistenciaListComponent },
      { path: 'centros-escolares', component: CentrosEscolaresListComponent },
      { path: 'centros-escolares/:id/grupos', component: CentrosEscolaresGruposListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
  },
  { path: '**', redirectTo: '' },
];
