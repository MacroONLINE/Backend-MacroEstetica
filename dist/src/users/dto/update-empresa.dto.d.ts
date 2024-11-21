export declare enum TargetEnum {
    MEDICO = "MEDICO",
    ESTETICISTA = "ESTETICISTA"
}
export declare class UpdateEmpresaDto {
    dni: string;
    name: string;
    target: TargetEnum;
    categoryId?: string;
}
