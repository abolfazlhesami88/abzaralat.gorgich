"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const cookieParser = require('cookie-parser');
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    const config = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    app.use(cookieParser());
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    const apiPrefix = config.get('API_PREFIX', 'api');
    app.setGlobalPrefix(apiPrefix);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    if (config.get('NODE_ENV') !== 'production') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('ToolStore Pro API')
            .setDescription('مستندات API فروشگاه ابزار')
            .setVersion('1.0')
            .addBearerAuth()
            .addCookieAuth('refresh_token')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
    }
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
//# sourceMappingURL=main.js.map