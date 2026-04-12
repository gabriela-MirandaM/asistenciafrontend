import { Component, OnInit, inject, signal } from '@angular/core';
import { CentrosEscolaresService } from '../../../core/services/centros-escolares.service';
import { AuthStore } from '../../../core/services/auth.store';

@Component({
  selector: 'app-asistencia-list',
  imports: [],
  templateUrl: './asistencia-list.component.html'
})
export class AsistenciaListComponent implements OnInit {
  private service = inject(CentrosEscolaresService);
  private authStore = inject(AuthStore);

  alumnos = signal<any[]>([]);
  dias = signal<string[]>([]);
  asistencia = signal<Record<number, Record<string, boolean>>>({});
  observaciones = signal<Record<number, string>>({});

  selectedCentroId = signal<string | null>(null);
  selectedCentroNombre = signal<string>('');
  selectedGrupoId = signal<number | null>(null);
  selectedGrupoNombre = signal<string>('');

  fechaActual = signal(this.formatDate(new Date()));

  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.dias.set([this.fechaActual()]);
    this.initializeProfesorContext();
  }

  private initializeProfesorContext() {
    const token = this.authStore.getAccessToken();
    if (!token) {
      this.error.set('No se encontró sesión activa.');
      return;
    }

    const payload = this.decodeJwtPayload(token);
    const centroId = payload?.centroId ?? payload?.id_centro ?? payload?.centro?.id;
    const grupoId = payload?.grupoId ?? payload?.id_grupo ?? payload?.grupo?.id;
    const centroNombre = payload?.centroNombre ?? payload?.nombre_centro ?? payload?.centro?.nombre;
    const grupoNombre = payload?.grupoNombre ?? payload?.nombre_grupo ?? payload?.grupo?.nombre;

    if (!centroId || !grupoId) {
      this.error.set('No se pudo determinar el centro o grupo del profesor.');
      return;
    }

    this.selectedCentroId.set(String(centroId));
    this.selectedGrupoId.set(Number(grupoId));
    this.selectedCentroNombre.set(centroNombre ?? 'Centro asignado');
    this.selectedGrupoNombre.set(grupoNombre ?? 'Grupo asignado');

    this.loadAlumnos(Number(grupoId));
    this.loadAsistencia();
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
    this.loading.set(true);
    this.service.getAlumnosPorGrupo(String(grupoId)).subscribe({
      next: alumnos => {
        this.alumnos.set(alumnos ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudieron cargar los alumnos del grupo');
      }
    });
  }

  private loadAsistencia() {
    const centroId = this.selectedCentroId();
    if (!centroId) {
      return;
    }

    this.loading.set(true);
    const fecha = this.fechaActual();
    this.service.getAsistenciasPorCentro(centroId, fecha, fecha).subscribe({
      next: entries => {
        this.mapAsistencias(entries ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudieron cargar las asistencias');
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
    console.log('Guardar asistencia no implementado: usa el backend si existe un endpoint POST');
  }

  cancelar(): void {
    this.selectedCentroId.set(null);
    this.selectedCentroNombre.set('');
    this.selectedGrupoId.set(null);
    this.selectedGrupoNombre.set('');
    this.alumnos.set([]);
    this.asistencia.set({});
    this.observaciones.set({});
    this.error.set(null);
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
