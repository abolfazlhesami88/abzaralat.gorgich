import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'فرمت ایمیل صحیح نیست' })
  email: string;

  @IsString({ message: 'رمز عبور الزامی است' })
  password: string;
}
