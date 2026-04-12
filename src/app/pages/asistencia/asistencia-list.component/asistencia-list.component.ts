import { Component, OnInit, inject, signal } from '@angular/core';
import { CentrosEscolaresService } from '../../../core/services/centros-escolares.service';
import { GruposService } from '../../../core/services/grupos.service';
import { AuthStore } from '../../../core/services/auth.store';
import { LoadingService } from '../../../core/services/loading.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-asistencia-list',
  imports: [],
  templateUrl: './asistencia-list.component.html'
})
export class AsistenciaListComponent implements OnInit {
  private service = inject(CentrosEscolaresService);
  private gruposService = inject(GruposService);
  private authStore = inject(AuthStore);
  loadingService = inject(LoadingService);
  private notificationService = inject(NotificationService);

  alumnos = signal<any[]>([]);
  dias = signal<string[]>([]);
  asistencia = signal<Record<number, Record<string, boolean>>>({});
  observaciones = signal<Record<number, string>>({});

  selectedCentroId = signal<string | null>(null);
  selectedCentroNombre = signal<string>('');
  selectedGrupoId = signal<number | null>(null);
  selectedGrupoNombre = signal<string>('');

  fechaActual = signal(this.formatDate(new Date()));
  selectedDate = signal<string>('');

  step = signal<'select-date' | 'list'>('select-date');

  ngOnInit() {
    this.initializeProfesorContext();
  }

  private initializeProfesorContext() {
    const token = this.authStore.getAccessToken();
    if (!token) {
      this.notificationService.show('error', 'No se encontró sesión activa.');
      return;
    }

    const payload = this.decodeJwtPayload(token);
    const grupoId = payload?.grupoId ?? payload?.id_grupo ?? payload?.grupo?.id;
    const centroNombre = payload?.centroNombre ?? payload?.nombre_centro ?? payload?.centro?.nombre;
    const grupoNombre = payload?.grupoNombre ?? payload?.nombre_grupo ?? payload?.grupo?.nombre;

    if (!grupoId) {
      this.notificationService.show('error', 'No se pudo determinar el grupo del profesor.');
      return;
    }

    this.selectedGrupoId.set(Number(grupoId));
    this.selectedCentroNombre.set(centroNombre ?? 'Centro asignado');
    this.selectedGrupoNombre.set(grupoNombre ?? 'Grupo asignado');

    this.loadGrupoInfo(String(grupoId));
  }

  private loadGrupoInfo(grupoId: string) {
    this.gruposService.getGrupoPorId(grupoId).subscribe({
      next: grupo => {
        const centro = grupo?.centroEscolar;
        if (centro) {
          this.selectedCentroId.set(String(centro.id));
          this.selectedCentroNombre.set(centro.nombre ?? this.selectedCentroNombre());
        }
        this.selectedGrupoNombre.set(grupo?.nombre ?? this.selectedGrupoNombre());
      },
      error: () => {
        this.notificationService.show('error', 'No se pudo cargar la información del grupo asignado.');
      }
    });
  }

  seleccionarFecha(fecha: string) {
    if (!fecha) {
      this.notificationService.show('warning', 'Por favor seleccione una fecha.');
      return;
    }
    if (fecha !== this.fechaActual()) {
      this.notificationService.show('warning', 'Solo se puede registrar asistencia para la fecha actual.');
      return;
    }
    this.selectedDate.set(fecha);
  }

  cargarAsistencia() {
    if (!this.selectedDate()) {
      this.notificationService.show('warning', 'Por favor seleccione una fecha primero.');
      return;
    }
    this.step.set('list');
    this.loadAlumnos(this.selectedGrupoId()!);
    this.loadAsistencia();
  }

  volverASeleccionFecha() {
    this.step.set('select-date');
    this.selectedDate.set('');
    this.alumnos.set([]);
    this.asistencia.set({});
    this.observaciones.set({});
  }

  cancelar(): void {
    this.volverASeleccionFecha();
  }

  private decodeJwtPayload(token: string): any {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    try {
      const json = decodeURIComponent(
        atob(payload)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private loadAlumnos(grupoId: number) {
    this.service.getAlumnosPorGrupo(String(grupoId)).subscribe({
      next: alumnos => {
        this.alumnos.set(alumnos ?? []);
      },
      error: () => {
        this.notificationService.show('error', 'No se pudieron cargar los alumnos del grupo');
      }
    });
  }

  private loadAsistencia() {
    if (!this.selectedDate()) {
      return;
    }

    const fecha = this.selectedDate();
    const centroId = this.selectedCentroId();
    if (!centroId) {
      this.notificationService.show('error', 'No se encontró el centro escolar asignado.');
      return;
    }

    this.service.getAsistenciasPorCentro(centroId, fecha, fecha).subscribe({
      next: entries => {
        this.mapAsistencias(entries ?? []);
      },
      error: () => {
        this.notificationService.show('error', 'No se pudieron cargar las asistencias');
      }
    });
  }

  private mapAsistencias(entries: any[]) {
    const asistencia: Record<number, Record<string, boolean>> = {};
    const observaciones: Record<number, string> = {};
    const grupoId = this.selectedGrupoId();

    entries.forEach(entry => {
      const alumnoId = entry.alumno?.id ?? entry.alumnoId ?? entry.alumno_id;
      const fecha = entry.fecha ?? entry.date ?? entry.dia;
      const presente = entry.presente ?? entry.asistio ?? entry.asistencia ?? entry.present ?? false;
      const observacion = entry.observacion ?? entry.observaciones ?? entry.observacion_detalle;
      const entryGrupoId = entry.grupoId ?? entry.idGrupo ?? entry.grupo?.id;

      if (alumnoId == null || !fecha) {
        return;
      }

      if (grupoId != null && entryGrupoId != null && Number(entryGrupoId) !== grupoId) {
        return;
      }

      asistencia[alumnoId] ??= {};
      asistencia[alumnoId][fecha] = !!presente;

      if (observacion) {
        observaciones[alumnoId] = String(observacion);
      }
    });

    this.asistencia.set(asistencia);
    this.observaciones.set(observaciones);
  }

  isAsistio(alumnoId: number, dia: string): boolean {
    return this.asistencia()[alumnoId]?.[dia] ?? false;
  }

  toggleAsistencia(alumnoId: number, dia: string) {
    this.asistencia.update(state => {
      const alumno = state[alumnoId] ?? {};
      return {
        ...state,
        [alumnoId]: {
          ...alumno,
          [dia]: !alumno[dia]
        }
      };
    });
  }

  observacion(alumnoId: number): string {
    return this.observaciones()[alumnoId] ?? '';
  }

  setObservacion(alumnoId: number, value: string) {
    this.observaciones.update(state => ({
      ...state,
      [alumnoId]: value
    }));
  }

  diaLabel(dia: string): string {
    const [year, month, day] = dia.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const diasMap: Record<number, string> = {
      0: 'Dom',
      1: 'Lun',
      2: 'Mar',
      3: 'Mié',
      4: 'Jue',
      5: 'Vie',
      6: 'Sáb'
    };
    return `${diasMap[date.getDay()] ?? ''} ${date.getDate()}`;
  }

  semanaLabel(): string {
    return this.fechaActual();
  }

  guardar(): void {
    const grupoId = this.selectedGrupoId();
    const fecha = this.selectedDate();
    if (!grupoId || !fecha) {
      return;
    }

    this.loadingService.show();

    // Construir el payload según lo esperado por el backend
    const payload = {
      fecha: fecha,
      alumnos: this.alumnos().map(alumno => ({
        consentimiento: alumno.consentimiento ?? true,
        id: String(alumno.id),
        nombre: alumno.nombre ?? '',
        apellido: alumno.apellido ?? '',
        documento: alumno.documento ?? '',
        fechaEliminacion: alumno.fechaEliminacion ?? null,
        asistio: this.isAsistio(alumno.id, fecha),
        observaciones: this.observacion(alumno.id) || null
      }))
    };

    this.gruposService.guardarAsistencia(String(grupoId), payload).subscribe({
      next: () => {
        this.loadingService.hide();
        this.notificationService.show('success', 'Asistencia guardada exitosamente');
        // Limpiar y volver al selector de fecha
        setTimeout(() => {
          this.volverASeleccionFecha();
        }, 1000);
      },
      error: (err) => {
        this.loadingService.hide();
        console.error('Error al guardar asistencia:', err);
        this.notificationService.show('error', 'Error al guardar la asistencia. Intente nuevamente.');
      }
    });
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
