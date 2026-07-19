import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    findAll(userId: string): Promise<{
        data: import("./entities/address.entity").Address[];
    }>;
    create(userId: string, dto: CreateAddressDto): Promise<{
        data: import("./entities/address.entity").Address;
    }>;
    update(id: string, userId: string, dto: UpdateAddressDto): Promise<{
        data: import("./entities/address.entity").Address;
    }>;
    remove(id: string, userId: string): Promise<{
        data: null;
        message: string;
    }>;
    setDefault(id: string, userId: string): Promise<{
        data: import("./entities/address.entity").Address[];
    }>;
}
