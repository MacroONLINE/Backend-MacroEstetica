export declare class CreateMessageDto {
    name: string;
    phone: string;
    email: string;
    description?: string;
    userId?: string;
    empresaId?: string;
    productId?: string;
    type: 'direct' | 'product';
}
