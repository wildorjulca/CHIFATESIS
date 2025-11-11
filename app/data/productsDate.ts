import { Product } from "@/types/database.types";


export interface CartItem extends Product {
    quantity: number;
}

// data/products.ts
export const chifaProducts: CartItem[] = [
    {
        id: '1',
        name: 'Aeropuerto Especial',
        description: 'Arroz chaufa con pollo, chancho, camarones y tortilla',
        price: 28.00,
        category: 'menu',
        image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
        quantity: 2
    },
    {
        id: '2',
        name: 'Tallarín Saltado',
        description: 'Tallarín salteado con carne, verduras y salsa especial',
        price: 22.00,
        category: 'menu',
        image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
        quantity: 1
    },
    {
        id: '3',
        name: 'Arroz Chaufa de Pollo',
        description: 'Arroz frito con pollo, huevo y cebollín',
        price: 18.00,
        category: 'menu',
        image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        created_at: "",
        quantity: 3
    },
    {
        id: '4',
        name: 'Wantán Frito (6 unidades)',
        description: 'Wantanes rellenos fritos con salsa agridulce',
        price: 12.00,
        category: 'menu',
        image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
        quantity: 1
    },
    {
        id: '5',
        name: 'Sopa Wantán',
        description: 'Sopa con wantanes rellenos y verduras',
        price: 15.00,
        category: 'menu',
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        quantity: 2
    },
    //   {
    //     id: '6',
    //     name: 'Pollo con Almendras',
    //     description: 'Pollo salteado con almendras y verduras',
    //     price: 24.00,
    //     category: 'menu',
    //     image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
    //     available: true
    //   },
    //   {
    //     id: '7',
    //     name: 'Cerdo Agridulce',
    //     description: 'Cerdo en salsa agridulce con piña y pimientos',
    //     price: 23.00,
    //     category: 'menu',
    //     image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
    //     available: true
    //   },
    //   {
    //     id: '8',
    //     name: 'Chijaukay',
    //     description: 'Alitas de pollo crocantes con salsa especial',
    //     price: 20.00,
    //     category: 'Entradas',
    //     image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
    //     available: true
    //   },
    //   {
    //     id: '9',
    //     name: 'Té Chino',
    //     description: 'Té tradicional chino jasmine',
    //     price: 5.00,
    //     category: 'Bebidas',
    //     image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    //     available: true
    //   },
    //   {
    //     id: '10',
    //     name: 'Inca Kola 500ml',
    //     description: 'Refresco peruano sabor golden kola',
    //     price: 6.00,
    //     category: 'Bebidas',
    //     image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
    //     available: true
    //   },
    //   {
    //     id: '11',
    //     name: 'Lomo Saltado',
    //     description: 'Lomo de res salteado con cebolla, tomate y papas fritas',
    //     price: 26.00,
    //     category: 'Platos Criollos',
    //     image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
    //     available: true
    //   },
    //   {
    //     id: '12',
    //     name: 'Kam Lu Wantán',
    //     description: 'Wantán frito con salsa kam lu (agridulce espesa)',
    //     price: 16.00,
    //     category: 'Entradas',
    //     image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    //     available: true
    //   },
    //   {
    //     id: '13',
    //     name: 'Arroz Chaufa Especial',
    //     description: 'Arroz chaufa con pollo, chancho, camarones y tortilla',
    //     price: 25.00,
    //     category: 'Platos Principales',
    //     image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    //     available: true
    //   },
    //   {
    //     id: '14',
    //     name: 'Sopa de Pollo con Maíz',
    //     description: 'Sopa cremosa de pollo con maíz dulce',
    //     price: 14.00,
    //     category: 'Sopas',
    //     image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    //     available: true
    //   }
];