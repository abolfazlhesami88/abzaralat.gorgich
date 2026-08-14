import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { DataSource } from 'typeorm';

describe('DashboardService', () => {
  let service: DashboardService;
  
  const mockDataSource = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getRepositoryToken(Order), useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(Product), useValue: {} },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly format SQL query dates and map results', async () => {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    const dateStr = from.toISOString().split('T')[0];
    
    // Simulate raw DB result with TO_CHAR output (string)
    mockDataSource.query.mockResolvedValue([
      { date: dateStr, revenue: '1000', orders: '2' }
    ]);
    
    const chart = await service.getRevenueChart('7d');
    
    // Check SQL has TO_CHAR
    expect(mockDataSource.query.mock.calls[0][0]).toContain("TO_CHAR(created_at, 'YYYY-MM-DD') as date");
    
    // Find the record for that specific date string
    const targetDay = chart.find(c => c.date === dateStr);
    expect(targetDay).toBeDefined();
    expect(targetDay!.revenue).toBe(1000);
    expect(targetDay!.orders).toBe(2);
  });
});
