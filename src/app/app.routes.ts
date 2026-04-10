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
import { UsuariosAsignarRolesComponent } from './pages/usuarios/usuarios-asignar-roles/usuarios-asignar-roles.component';
import { GruposListComponent } from './pages/grupos/grupos-list/grupos-list.component';
import { GrupoCreateComponent } from './pages/grupos/grupo-create/grupo-create.component';
import { GrupoEditComponent } from './pages/grupos/grupo-edit/grupo-edit.component';
import { PermisosListComponent } from './pages/permisos/permisos-list/permisos-list.component';
import { PermisoCreateComponent } from './pages/permisos/permiso-create/permiso-create.component';
import { PermisoEditComponent } from './pages/permisos/permiso-edit/permiso-edit.component';
import { RolesAsignarPermisosComponent } from './pages/roles/roles-asignar-permisos/roles-asignar-permisos.component';

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
      { path: 'usuarios/:id/roles', component: UsuariosAsignarRolesComponent },
      { path: 'roles', component: RolesListComponent },
      { path: 'roles/create', component: RoleCreateComponent },
      { path: 'roles/edit/:id', component: RoleEditComponent },
      { path: 'roles/:id/permisos', component: RolesAsignarPermisosComponent },
      { path: 'grupos', component: GruposListComponent },
      { path: 'grupos/create', component: GrupoCreateComponent },
      { path: 'grupos/edit/:id', component: GrupoEditComponent },
      { path: 'permisos', component: PermisosListComponent },
      { path: 'permisos/create', component: PermisoCreateComponent },
      { path: 'permisos/edit/:id', component: PermisoEditComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
  },
  { path: '**', redirectTo: '' },
];
