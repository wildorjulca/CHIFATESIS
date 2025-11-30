import instance from "@/lib/intance"
import { sleep } from "@/lib/sleep";

export interface Usuario {
  id_rol: number;
  nombre_completo: string;
  nombre_rol: string;
  correo: string;
  activo: boolean;
  creado_en: string;
  estadisticas: {
    total_pedidos: number;
    total_pagos: number;
  };
}

export interface UsuariosResponse {
  usuarios: Usuario[];
  estadisticas: {
    total_usuarios: number;
    usuarios_activos: number;
    por_rol: {
      admin: number;
      mesero: number;
      cajero: number;
      cocinero: number;
    };
  };
}

export const getAllUsuariosService = async (): Promise<UsuariosResponse> => {
  await sleep(2);
  try {
    const response = await instance.get("/getAllUsuarios");
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      console.error("Estructura de respuesta inesperada:", response.data);
      throw new Error("Estructura de datos incorrecta");
    }
  } catch (error: any) {
    console.error("Error en getAllUsuariosService:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Error al cargar usuarios");
    }
  }
}