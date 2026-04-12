import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CentrosEscolaresService } from '../../../core/services/centros-escolares.service';
import { GruposService } from '../../../core/services/grupos.service';

@Component({
  selector: 'app-centros-escolares-grupos-list',
  imports: [],
  templateUrl: './centros-escolares-grupos-list.component.html',
})
export class CentrosEscolaresGruposListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(CentrosEscolaresService);
  private gruposService = inject(GruposService);

  centroSeleccionado = signal<{ id: string; nombre: string; codigo?: string; direccion?: string; distrito?: string; turno?: string } | null>(null);
  grupos = signal<any[]>([]);
  grupoExpandido = signal<number | null>(null);
  selectedGrupoId = signal<number | null>(null);
  alumnosPorGrupo = signal<Record<number, any[]>>({});
  asistencia = signal<Record<number, Record<string, boolean>>>({});
  observaciones = signal<Record<number, Record<string, string>>>({});
  selectedTooltip = signal<{ alumnoId: number; dia: string } | null>(null);
  dias = signal<string[]>([]);
  fechaInicio = signal('');
  fechaFin = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    const centroId = this.route.snapshot.paramMap.get('id');
    if (!centroId) {
      this.error.set('ID de centro no encontrado');
      return;
    }

    const [start, end] = this.getDefaultDateRange();
    this.fechaInicio.set(start);
    this.fechaFin.set(end);
    this.dias.set(this.buildDias(start, end));

    this.loadGrupos(centroId);
    this.loadAsistencias(centroId);
  }

  private loadGrupos(centroId: string) {
    this.loading.set(true);
    this.service.getGruposPorCentro(centroId).subscribe({
      next: grupos => this.grupos.set(grupos ?? []),
      error: () => {
        this.error.set('No se pudieron cargar los grupos');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  }

  private loadAsistencias(centroId: string) {
    const start = this.fechaInicio();
    const end = this.fechaFin();
    this.dias.set(this.buildDias(start, end));
    this.error.set(null);
    this.loading.set(true);

    this.service.getAsistenciasPorCentro(centroId, start, end).subscribe({
      next: entries => this.mapAsistencias(entries ?? []),
      error: () => {
        this.error.set('No se pudieron cargar las asistencias');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  }

  toggleGrupo(grupoId: number) {
    const expanded = this.grupoExpandido() === grupoId ? null : grupoId;
    this.grupoExpandido.set(expanded);
    this.selectedGrupoId.set(expanded);

    if (expanded === null) {
      return;
    }

    this.loadGrupoDetalle(grupoId);

    if (this.alumnosPorGrupo()[grupoId]?.length) {
      return;
    }

    this.service.getAlumnosPorGrupo(String(grupoId)).subscribe({
      next: alumnos => {
        this.alumnosPorGrupo.update(state => ({
          ...state,
          [grupoId]: alumnos ?? []
        }));
      },
      error: () => {
        this.error.set('No se pudieron cargar los alumnos del grupo');
        this.loading.set(false);
      }
    });
  }

  alumnosPorGrupoList(grupoId: number): any[] {
    return this.alumnosPorGrupo()[grupoId] ?? [];
  }

  observacion(alumnoId: number, dia: string): string {
    return this.observaciones()[alumnoId]?.[dia] ?? '';
  }

  isAsistio(alumnoId: number, dia: string): boolean {
    return this.asistencia()[alumnoId]?.[dia] ?? false;
  }

  toggleTooltip(alumnoId: number, dia: string, event: Event) {
    event.stopPropagation();
    const current = this.selectedTooltip();
    if (current?.alumnoId === alumnoId && current?.dia === dia) {
      this.selectedTooltip.set(null);
      return;
    }
    this.selectedTooltip.set({ alumnoId, dia });
  }

  isTooltipOpen(alumnoId: number, dia: string): boolean {
    const current = this.selectedTooltip();
    return current?.alumnoId === alumnoId && current?.dia === dia;
  }

  @HostListener('document:click')
  closeTooltip(): void {
    this.selectedTooltip.set(null);
  }

  diaLabel(dia: string): string {
    const [y, m, d] = dia.split('-').map(Number);
    const date = new Date(y, m - 1, d);

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

  private mapAsistencias(entries: any[]) {
    const asistencia: Record<number, Record<string, boolean>> = {};
    const observaciones: Record<number, Record<string, string>> = {};

    entries.forEach(entry => {
      const alumnoId = Number(entry.id ?? entry.alumno?.id ?? entry.alumnoId ?? entry.alumno_id);
      const asistenciasList = entry.asistencias ?? entry.asistencia ?? [];
      const detalles = Array.isArray(asistenciasList) ? asistenciasList : [asistenciasList];

      if (Number.isNaN(alumnoId)) {
        return;
      }

      detalles.forEach(item => {
        const fecha = item.fecha ?? item.date ?? item.dia;
        const presente = item.asistio ?? item.presente ?? item.asistencia ?? item.present ?? false;
        const observacion = item.observaciones ?? item.observacion ?? item.observacion_detalle;

        if (!fecha) {
          return;
        }

        asistencia[alumnoId] ??= {};
        asistencia[alumnoId][fecha] = !!presente;

        if (observacion) {
          observaciones[alumnoId] ??= {};
          observaciones[alumnoId][fecha] = String(observacion);
        }
      });
    });

    this.asistencia.set(asistencia);
    this.observaciones.set(observaciones);
  }

  private getDefaultDateRange(): [string, string] {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const saturday = new Date(monday);
    saturday.setDate(monday.getDate() + 5);

    return [this.formatDate(monday), this.formatDate(saturday)];
  }

  private loadGrupoDetalle(grupoId: number) {
    this.gruposService.getGrupoPorId(String(grupoId)).subscribe({
      next: grupo => {
        const centro = grupo?.centroEscolar ?? grupo?.centro ?? grupo?.centro_escolar;
        if (centro) {
          this.centroSeleccionado.set({
            id: String(centro.id ?? ''),
            nombre: centro?.nombre ?? centro?.name ?? '',
            codigo: centro?.codigo,
            direccion: centro?.direccion,
            distrito: centro?.distrito?.nombre ?? centro?.distrito,
            turno: centro?.turno?.nombre ?? centro?.turno
          });
        }
      },
      error: () => {
        this.error.set('No se pudo cargar los detalles del grupo');
      }
    });
  }

  setFechaInicio(value: string) {
    this.fechaInicio.set(value);
  }

  setFechaFin(value: string) {
    this.fechaFin.set(value);
  }

  reloadAsistencias() {
    const centroId = this.centroSeleccionado()?.id;
    if (!centroId) {
      this.error.set('ID de centro no encontrado');
      return;
    }
    this.loadAsistencias(centroId);
  }

  private buildDias(start: string, end: string): string[] {
    const dates: string[] = [];
    let current = this.parseLocalDate(start);
    const endDate = this.parseLocalDate(end);

    while (current <= endDate) {
      if (current.getDay() !== 0) {
        dates.push(this.formatDate(current));
      }
      current = new Date(current);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  private parseLocalDate(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
