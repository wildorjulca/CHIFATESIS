import { create } from "zustand";
import { persist } from "zustand/middleware";

// =============================
// TIPOS BASADOS EN TU SCHEMA PRISMA
// =============================
export interface MenuItem {
    id_menu: number;
    nombre_plato: string;
    descripcion?: string;
    precio: number;
    categoria: string;
    tiempo_preparacion?: number;
    disponible: boolean;
    imagen_url?: string;
    oferta?: boolean;
    descuento?: number | null;
}

export interface BebidaItem {
    id_bebida: number;
    nombre_bebida: string;
    descripcion?: string;
    precio: number;
    categoria: string;
    tamano?: string;
    disponible: boolean;
    imagen_url?: string;
}

export type ItemCarrito = {
    id: string; // formato: "menu-1" o "bebida-5"
    tipo: "menu" | "bebida";
    nombre: string;
    precio_unitario: number;
    cantidad: number;
    imagen?: string;
    subtotal: number;
};

// =============================
// STORE DE ZUSTAND
// =============================
interface CartState {
    items: ItemCarrito[];
    getSumaryInformation: () => {
        totalPagar: number;
        totalItems: number;
    };

    // acciones
    agregarItem: (item: MenuItem | BebidaItem, tipo: "menu" | "bebida") => void;
    eliminarItem: (id: string) => void;
    cambiarCantidad: (id: string, cantidad: number) => void;
    limpiarCarrito: () => void;

    // totales
    totalItems: number;
    totalPagar: number;
}

// =============================
// IMPLEMENTACIÓN DEL STORE
// =============================
export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    getSumaryInformation: () => {
        const { items } = get();
        const totalPagar = items.reduce(
            (acc, item) => acc + item.cantidad * item.precio_unitario,
            0
        );
        const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

        return {
            totalPagar,
            totalItems,
        };
    },

    agregarItem: (item, tipo) => {
        const id = tipo === "menu" ? `menu-${(item as MenuItem).id_menu}` : `bebida-${(item as BebidaItem).id_bebida}`;
        const existing = get().items.find(i => i.id === id);

        if (existing) {
            // ya existe → incrementar cantidad
            set({
                items: get().items.map(i =>
                    i.id === id
                        ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precio_unitario }
                        : i
                ),
            });
        } else {
            // nuevo item
            const nuevo: ItemCarrito = {
                id,
                tipo,
                nombre:
                    tipo === "menu" ? (item as MenuItem).nombre_plato : (item as BebidaItem).nombre_bebida,
                precio_unitario: Number(item.precio),
                cantidad: 1,
                imagen:
                    tipo === "menu" ? (item as MenuItem).imagen_url : (item as BebidaItem).imagen_url,
                subtotal: Number(item.precio),
            };
            set({ items: [...get().items, nuevo] });
        }
    },

    eliminarItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) });
    },

    cambiarCantidad: (id, cantidad) => {
        if (cantidad <= 0) {
            set({ items: get().items.filter(i => i.id !== id) });
        } else {
            set({
                items: get().items.map(i =>
                    i.id === id ? { ...i, cantidad, subtotal: cantidad * i.precio_unitario } : i
                ),
            });
        }
    },

    limpiarCarrito: () => set({ items: [] }),

    // Getters computados
    get totalItems() {
        return get().items.reduce((acc, i) => acc + i.cantidad, 0);
    },

    get totalPagar() {
        return get().items.reduce((acc, i) => acc + i.subtotal, 0);
    },

}))

