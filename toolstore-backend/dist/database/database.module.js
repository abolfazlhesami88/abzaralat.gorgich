"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../modules/users/entities/user.entity");
const category_entity_1 = require("../modules/categories/entities/category.entity");
const brand_entity_1 = require("../modules/brands/entities/brand.entity");
const product_entity_1 = require("../modules/products/entities/product.entity");
const product_image_entity_1 = require("../modules/products/entities/product-image.entity");
const product_variant_entity_1 = require("../modules/products/entities/product-variant.entity");
const product_spec_entity_1 = require("../modules/products/entities/product-spec.entity");
const address_entity_1 = require("../modules/addresses/entities/address.entity");
const cart_entity_1 = require("../modules/cart/entities/cart.entity");
const cart_item_entity_1 = require("../modules/cart/entities/cart-item.entity");
const order_entity_1 = require("../modules/orders/entities/order.entity");
const order_item_entity_1 = require("../modules/orders/entities/order-item.entity");
const review_entity_1 = require("../modules/reviews/entities/review.entity");
const coupon_entity_1 = require("../modules/coupons/entities/coupon.entity");
const wishlist_entity_1 = require("../modules/wishlist/entities/wishlist.entity");
const notification_entity_1 = require("../modules/notifications/entities/notification.entity");
const entities = [
    user_entity_1.User, category_entity_1.Category, brand_entity_1.Brand,
    product_entity_1.Product, product_image_entity_1.ProductImage, product_variant_entity_1.ProductVariant, product_spec_entity_1.ProductSpec,
    address_entity_1.Address, cart_entity_1.Cart, cart_item_entity_1.CartItem,
    order_entity_1.Order, order_item_entity_1.OrderItem,
    review_entity_1.Review, coupon_entity_1.Coupon, wishlist_entity_1.Wishlist, notification_entity_1.Notification,
];
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST'),
                    port: config.get('DB_PORT'),
                    username: config.get('DB_USERNAME'),
                    password: config.get('DB_PASSWORD'),
                    database: config.get('DB_NAME'),
                    entities,
                    migrations: [__dirname + '/migrations/**/*.{ts,js}'],
                    synchronize: config.get('DB_SYNCHRONIZE') === 'true',
                    logging: config.get('DB_LOGGING') === 'true',
                    ssl: config.get('NODE_ENV') === 'production'
                        ? { rejectUnauthorized: false }
                        : false,
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        exports: [typeorm_1.TypeOrmModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map