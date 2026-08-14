import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['refresh_token'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: (configService.get('jwt.refreshSecret') || configService.get('JWT_REFRESH_SECRET') || 'toolstore_refresh_secret_key_2024') as string,
      passReqToCallback: true,
    } as any);
  }

  async validate(req: any, payload: any) {
    const refreshToken = req.cookies?.refresh_token;
    return { ...payload, refreshToken };
  }
}
