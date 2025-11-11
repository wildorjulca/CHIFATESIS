export interface User {
  id: string;
  email: string;
  role: 'admin' | 'cajero' | 'cliente';
  name: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'menu' | 'bebidas';
  image_url: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pendiente' | 'confirmado' | 'completado';
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  method: 'efectivo' | 'yape' | 'plin' | 'tarjeta';
  amount: number;
  status: 'pendiente' | 'completado';
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}
