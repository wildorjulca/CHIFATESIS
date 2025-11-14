export interface Menu {
  id_menu: number;
  nombre_plato: string;
  descripcion: string;
  precio: string; // 👈 si viene como string del backend, mantenlo así
  categoria: string;
  tiempo_preparacion: number;
  disponible: boolean;
  imagen_url: string;
  oferta: boolean;
  descuento: string | null;
  creado_en: string; // o Date si lo parseas
  actualizado_en: string; // o Date si lo parseas
};

export type MenuResponse = {
  succes: boolean;
  status: number;
  message: string;
  data: Menu[];
};