export declare class CreateAddressDto {
    label?: string;
    fullName: string;
    phone: string;
    province: string;
    city: string;
    addressLine: string;
    postalCode: string;
    isDefault?: boolean;
}
export declare class UpdateAddressDto extends CreateAddressDto {
}
