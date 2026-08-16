import { IsArray, IsEnum, IsNumber, IsPositive, ArrayMinSize, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BulkActionType {
  PRICE_PERCENT_INC = 'PRICE_PERCENT_INC',
  PRICE_PERCENT_DEC = 'PRICE_PERCENT_DEC',
  PRICE_FIXED_INC = 'PRICE_FIXED_INC',
  PRICE_FIXED_DEC = 'PRICE_FIXED_DEC',
  STOCK_ADD = 'STOCK_ADD',
  STOCK_SET = 'STOCK_SET',
}

export class BulkEditDto {
  @ApiProperty({ description: 'Array of product UUIDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  productIds: string[];

  @ApiProperty({ enum: BulkActionType, description: 'The mathematical operation to perform' })
  @IsEnum(BulkActionType)
  actionType: BulkActionType;

  @ApiProperty({ description: 'The value for the operation', example: 10 })
  @IsNumber()
  @IsPositive()
  value: number;
}
