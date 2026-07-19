import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
export declare class AddressesService {
    private readonly addressRepo;
    constructor(addressRepo: Repository<Address>);
    findAll(userId: string): Promise<Address[]>;
    create(userId: string, dto: CreateAddressDto): Promise<Address>;
    update(addressId: string, userId: string, dto: UpdateAddressDto): Promise<Address>;
    remove(addressId: string, userId: string): Promise<void>;
    setDefault(addressId: string, userId: string): Promise<Address[]>;
    private findOne;
}
