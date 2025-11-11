export interface Menu  {
  id_menu: number;
  nombre_plato: string;
  descripcion: string;
  precio: string; // o number si lo conviertes antes de usarlo
  tiempo_preparacion: number;
  oferta: boolean;
  creado_en: string; // formato ISO date
  imagen_url?: string;
};

export type MenuResponse = {
  succes: boolean;
  status: number;
  message: string;
  data: Menu[];
};