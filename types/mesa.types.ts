// Representa una sola mesa del restaurante
export interface Mesa {
  id_mesa: number;
  nombre_mesa: string;
  capacidad: number;
  estado: "libre" | "ocupada" | "reservada" | "mantenimiento";
  
}

// Estructura general de la respuesta
export interface MesasResponse {
  succes: boolean; // *Nota:* parece tener un error de ortografía, debería ser "success"
  status: number;
  message: string;
  data: Mesa[];
}