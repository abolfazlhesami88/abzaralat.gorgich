import { Test, TestingModule } from '@nestjs/testing';
import { AdminProductsService } from './admin-products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../products/entities/product.entity';
import { ProductImage } from '../../products/entities/product-image.entity';
import { ProductSpec } from '../../products/entities/product-spec.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { DataSource } from 'typeorm';

describe('AdminProductsService', () => {
  let service: AdminProductsService;
  
  const mockProductRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };
  const mockVariantRepo = {
    delete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminProductsService,
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
        { provide: getRepositoryToken(ProductImage), useValue: {} },
        { provide: getRepositoryToken(ProductSpec), useValue: { delete: jest.fn() } },
        { provide: getRepositoryToken(ProductVariant), useValue: mockVariantRepo },
        { provide: DataSource, useValue: {} },
      ],
    }).compile();

    service = module.get<AdminProductsService>(AdminProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete and recreate variants during update if provided', async () => {
    const productId = 'test-id';
    const dto: any = { variants: [{ name: 'Red', priceModifier: 100 }] };
    
    mockProductRepo.findOne.mockResolvedValue({ id: productId });
    mockVariantRepo.create.mockReturnValue({ name: 'Red', priceModifier: 100, productId });
    
    await service.update(productId, dto);
    
    expect(mockVariantRepo.delete).toHaveBeenCalledWith({ productId });
    expect(mockVariantRepo.create).toHaveBeenCalledWith({ name: 'Red', priceModifier: 100, productId });
    expect(mockVariantRepo.save).toHaveBeenCalled();
  });
  
  it('should not delete variants if variants property is undefined', async () => {
    const productId = 'test-id';
    const dto: any = { name: 'New Name' }; // variants undefined
    
    mockProductRepo.findOne.mockResolvedValue({ id: productId });
    
    await service.update(productId, dto);
    
    expect(mockVariantRepo.delete).not.toHaveBeenCalled();
    expect(mockVariantRepo.save).not.toHaveBeenCalled();
  });

  it('should delete all variants if variants property is an empty array', async () => {
    const productId = 'test-id';
    const dto: any = { variants: [] };
    
    mockProductRepo.findOne.mockResolvedValue({ id: productId });
    
    await service.update(productId, dto);
    
    expect(mockVariantRepo.delete).toHaveBeenCalledWith({ productId });
    expect(mockVariantRepo.save).not.toHaveBeenCalled();
  });
});
