import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'فرمت ایمیل صحیح نیست' })
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' })
  @MaxLength(50, { message: 'رمز عبور نباید بیشتر از ۵۰ کاراکتر باشد' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد',
  })
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
