import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'فرمت ایمیل صحیح نیست' })
  email?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' })
  @MaxLength(50, { message: 'رمز عبور نباید بیشتر از ۵۰ کاراکتر باشد' })
  passwordHash?: string | null; // Will be hashed in the entity hook

  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;
}
