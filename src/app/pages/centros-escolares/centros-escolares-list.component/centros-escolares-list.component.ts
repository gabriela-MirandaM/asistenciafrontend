import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CentrosEscolaresService } from '../../../core/services/centros-escolares.service';

@Component({
  selector: 'app-centros-escolares-list',
  imports: [],
  templateUrl: './centros-escolares-list.component.html',
})
export class CentrosEscolaresListComponent implements OnInit {
  private router = inject(Router);
  private service = inject(CentrosEscolaresService);

  centros = signal<any[]>([]);
  searchTerm = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  centrosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase();

    if (!term) {
      return this.centros();
    }

    return this.centros().filter(c =>
      String(c.nombre).toLowerCase().includes(term) ||
      String(c.codigo).toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadCentrosEscolares();
  }

  setSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  limpiarBusqueda() {
    this.searchTerm.set('');
  }

  private loadCentrosEscolares() {
    this.loading.set(true);
    this.error.set(null);

    this.service.getCentrosEscolares(1, 50, 'id', 'asc', '').subscribe({
      next: response => {
        const centros = Array.isArray(response)
          ? response
          : response?.data ?? response?.centros ?? [];

        this.centros.set(centros);
      },
      error: () => {
        this.error.set('No se pudieron cargar los centros escolares');
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  seleccionarCentro(centro: any) {
    this.router.navigate([`/centros-escolares/${centro.id}/grupos`]);
  }
}
