export interface Bebida {
  id_bebida: number;
  nombre_bebida: string;
  descripcion: string;
  precio: string; // viene como string en tu JSON, puedes cambiar a number si lo parseas
  categoria: string;
  tamano: string;
  disponible: boolean;
  imagen_url: string;
  creado_en: string; // o Date si lo conviertes al cargar
};
