import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
const cookieParser = require('cookie-parser');
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static assets for uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const config = app.get(ConfigService);

  // ─── Security ───────────────────────────────────────────────────
  app.use(helmet());
  app.use(cookieParser());

  // ─── CORS ───────────────────────────────────────────────────────
  app.enableCors({
    origin: true, // برای جلوگیری از مشکلات CORS در محیط توسعه
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // ─── Global Prefix ──────────────────────────────────────────────
  const apiPrefix = config.get('API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix);

  // ─── Validation ─────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // فیلدهای غیرمجاز حذف میشوند
      forbidNonWhitelisted: true, // فیلد غیرمجاز = خطا
      transform: true,        // تبدیل خودکار نوع داده
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── Serializer — Exclude کردن فیلدهای @Exclude() ───────────────
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // ─── Swagger ────────────────────────────────────────────────────
  if (config.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('ToolStore Pro API')
      .setDescription('مستندات API فروشگاه ابزار')
      .setVersion('1.0')
      .addBearerAuth()
      .addCookieAuth('refresh_token')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  // ─── Start ──────────────────────────────────────────────────────
  const port = config.get('PORT', 3000);
  await app.listen(port);

  console.log(`
  ╔══════════════════════════════════════╗
  ║     ToolStore Pro — API Running      ║
  ╠══════════════════════════════════════╣
  ║  Server:   http://localhost:${port}      ║
  ║  API:      http://localhost:${port}/${apiPrefix}  ║
  ║  Docs:     http://localhost:${port}/docs ║
  ║  Env:      ${config.get('NODE_ENV')}            ║
  ╚══════════════════════════════════════╝
  `);
}
bootstrap();
