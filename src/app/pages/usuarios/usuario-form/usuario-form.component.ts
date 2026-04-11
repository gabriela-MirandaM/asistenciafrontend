import {
  Component,
  input,
  output,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { User } from '../../../models/user.interface';
import { RoleService } from '../../../core/services/role.service';
import { Role } from '../../../models/role';

@Component({
  selector: 'app-usuario-form',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-form.component.html',
})
export class UsuarioFormComponent implements OnInit {
  user = input<User>();
  formSubmit = output<Partial<User>>();

  form: FormGroup;

  roles = signal<Role[]>([]);
  // Señales manuales de errores
  touchedFields = signal({
    username: false,
    nombre: false,
    email: false,
    password: false,
    id_rol: false,
  });

  // Computed que depende de la señal `touchedFields`
  usernameError = computed(() => {
    return this.touchedFields().username && this.form.get('username')?.invalid;
  });

  emailError = computed(() => {
    return this.touchedFields().email && this.form.get('email')?.invalid;
  });

  nombreError = computed(() => {
    return this.touchedFields().nombre && this.form.get('nombre')?.invalid;
  });

  passwordError = computed(() => {
    return this.touchedFields().password && this.form.get('password')?.invalid;
  });

  idRoleError = computed(() => {
    return this.touchedFields().id_rol && this.form.get('id_rol')?.invalid;
  });

  constructor(private fb: FormBuilder, private roleService: RoleService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      isActive: [true],
      id_rol: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.user) {
      this.form.patchValue(this.user() as Partial<User>);
      this.roleService.getRolesActivos().subscribe((res) => this.roles.set(res.data));
      this.form.get('id_rol')?.setValue(this.user()?.role.id); // Aseguramos que el id del rol se establezca correctamente
    }

    // Escuchar los cambios manualmente
    this.form
      .get('username')
      ?.valueChanges.subscribe(() => this.markTouched('username'));
    this.form
      .get('nombre')
      ?.valueChanges.subscribe(() => this.markTouched('nombre'));
    this.form
      .get('email')
      ?.valueChanges.subscribe(() => this.markTouched('email'));
    this.form
      .get('password')
      ?.valueChanges.subscribe(() => this.markTouched('password'));
    this.form
      .get('id_rol')
      ?.valueChanges.subscribe(() => this.markTouched('id_rol'));
  }

  markTouched(field: 'username' | 'nombre' | 'email' | 'password' | 'id_rol') {
    this.touchedFields.update((current) => ({
      ...current,
      [field]: true,
    }));
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      // Actualizamos todas las señales de campos como tocadas
      this.touchedFields.set({
        username: true,
        nombre: true,
        email: true,
        password: true,
        id_rol: true,
      });

      return;
    }

    this.formSubmit.emit(this.form.value);
  }
}
