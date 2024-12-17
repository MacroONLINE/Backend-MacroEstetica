export declare enum SubscriptionType {
    ORO = "ORO",
    PLATA = "PLATA",
    BRONCE = "BRONCE"
}
export declare enum GiroEnum {
    SERVICIOS = "SERVICIOS",
    PRODUCTOS = "PRODUCTOS",
    CONSULTORIA = "CONSULTORIA",
    OTRO = "OTRO"
}
export declare class CreateEmpresaDto {
    dni?: string;
    name: string;
    giro?: GiroEnum;
    subscription?: SubscriptionType;
    userId: string;
}
