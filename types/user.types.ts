
export interface UserInfo {
    user: {
        id: number;
        correo: string;
        rol: string // puedes ajustar los roles posibles
    };
}
export interface AuthResponse {
    ok: boolean;
    message: string;
    status: number;
    user: {
        id: number;
        correo: string;
        rol: string; // puedes ajustar los roles posibles
    };
};
