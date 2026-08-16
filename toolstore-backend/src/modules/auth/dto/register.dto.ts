import { IsString, MinLength, MaxLength, Matches, IsOptional, IsNotEmpty, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmailOrPhoneConstraint } from './login.dto';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com یا 09123456789' })
  @IsNotEmpty({ message: 'ایمیل یا شماره موبایل الزامی است' })
  @IsString()
  @Validate(IsEmailOrPhoneConstraint)
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  identifier: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' })
  @MaxLength(50, { message: 'رمز عبور نباید بیشتر از ۵۰ کاراکتر باشد' })
  password: string;

  @ApiProperty({ example: 'علی', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({ example: 'احمدی', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;
}
