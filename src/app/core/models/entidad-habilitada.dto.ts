export interface EntidadHabilitadaDto {
  id?: number;
  ruc?: string;
  razonSocial?: string;
  nombreComercial?: string;
  tipo?: string;
  direccion?: string;
  ubigeo?: { codigoUbigeo?: string };
  ubigeoCodigo?: string;
  codigoUbigeo?: string;
  estado?: string;
  fechaAutorizacion?: string;
  fechaHabilitacion?: string;
  fechaRegistro?: string;
  fechaActualizacion?: string;
}
