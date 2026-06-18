import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoEntidad',
  standalone: true,
})
export class TipoEntidadPipe implements PipeTransform {
  transform(tipo: string | null | undefined): string {
    if (!tipo) {
      return '-';
    }

    switch (tipo) {
      case 'E':
        return 'Escuela';
      case 'M':
        return 'Centro médico';
      case 'V':
        return 'Centro de evaluación';
      default:
        return tipo;
    }
  }
}
