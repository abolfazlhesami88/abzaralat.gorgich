"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("../products/entities/product.entity");
const product_image_entity_1 = require("../products/entities/product-image.entity");
const product_spec_entity_1 = require("../products/entities/product-spec.entity");
const product_variant_entity_1 = require("../products/entities/product-variant.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const user_entity_1 = require("../users/entities/user.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const brand_entity_1 = require("../brands/entities/brand.entity");
const coupon_entity_1 = require("../coupons/entities/coupon.entity");
const review_entity_1 = require("../reviews/entities/review.entity");
const dashboard_controller_1 = require("./dashboard/dashboard.controller");
const admin_products_controller_1 = require("./products/admin-products.controller");
const admin_orders_controller_1 = require("./orders/admin-orders.controller");
const admin_customers_controller_1 = require("./customers/admin-customers.controller");
const admin_categories_controller_1 = require("./categories/admin-categories.controller");
const admin_brands_controller_1 = require("./brands/admin-brands.controller");
const admin_coupons_controller_1 = require("./coupons/admin-coupons.controller");
const admin_reviews_controller_1 = require("./reviews/admin-reviews.controller");
const dashboard_service_1 = require("./dashboard/dashboard.service");
const admin_products_service_1 = require("./products/admin-products.service");
const admin_customers_service_1 = require("./customers/admin-customers.service");
const products_module_1 = require("../products/products.module");
const categories_module_1 = require("../categories/categories.module");
const brands_module_1 = require("../brands/brands.module");
const orders_module_1 = require("../orders/orders.module");
const coupons_module_1 = require("../coupons/coupons.module");
const reviews_module_1 = require("../reviews/reviews.module");
const upload_module_1 = require("../upload/upload.module");
const notifications_module_1 = require("../notifications/notifications.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                product_entity_1.Product, product_image_entity_1.ProductImage, product_spec_entity_1.ProductSpec, product_variant_entity_1.ProductVariant,
                order_entity_1.Order, user_entity_1.User, category_entity_1.Category, brand_entity_1.Brand, coupon_entity_1.Coupon, review_entity_1.Review,
            ]),
            products_module_1.ProductsModule, categories_module_1.CategoriesModule, brands_module_1.BrandsModule,
            orders_module_1.OrdersModule, coupons_module_1.CouponsModule, reviews_module_1.ReviewsModule,
            upload_module_1.UploadModule, notifications_module_1.NotificationsModule,
        ],
        controllers: [
            dashboard_controller_1.DashboardController,
            admin_products_controller_1.AdminProductsController,
            admin_orders_controller_1.AdminOrdersController,
            admin_customers_controller_1.AdminCustomersController,
            admin_categories_controller_1.AdminCategoriesController,
            admin_brands_controller_1.AdminBrandsController,
            admin_coupons_controller_1.AdminCouponsController,
            admin_reviews_controller_1.AdminReviewsController,
        ],
        providers: [dashboard_service_1.DashboardService, admin_products_service_1.AdminProductsService, admin_customers_service_1.AdminCustomersService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map