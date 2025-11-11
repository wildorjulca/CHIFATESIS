export interface AuthResponse {
  ok: boolean
  message: string
  status: number
  token?: string
  user?: {
    id: number
    correo: string
    nombre: string
  }
}
