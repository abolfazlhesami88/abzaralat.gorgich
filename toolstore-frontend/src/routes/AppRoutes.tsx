import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/public/HomePage';
import { ProductListPage } from '../pages/public/ProductListPage';
import { CategoryPage } from '../pages/public/CategoryPage';
import { SearchPage } from '../pages/public/SearchPage';
import { ProductDetailPage } from '../pages/public/ProductDetailPage';
import { CartPage } from '../pages/public/CartPage';
import { CheckoutPage } from '../pages/public/CheckoutPage';
import { OrderSuccessPage } from '../pages/public/OrderSuccessPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { PrivateRoute } from './PrivateRoute';
import { AccountLayout } from '../layouts/AccountLayout';
import { AccountDashboard } from '../pages/account/AccountDashboard';
import { ProfilePage } from '../pages/account/ProfilePage';
import { AddressesPage } from '../pages/account/AddressesPage';
import { OrdersPage } from '../pages/account/OrdersPage';
import { OrderDetailPage } from '../pages/account/OrderDetailPage';
import { WishlistPage } from '../pages/account/WishlistPage';
import { NotificationsPage } from '../pages/account/NotificationsPage';
import { adminRoutes } from './adminRoutes';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders/:orderNumber/success" element={<OrderSuccessPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* آدرس ورود اختصاصی پنل مدیریت */}
      <Route path="/adminsite" element={<AdminLoginPage />} />

      <Route
        path="/account"
        element={
          <PrivateRoute>
            <AccountLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AccountDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="addresses" element={<AddressesPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:orderNumber" element={<OrderDetailPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      {/* Admin Panel */}
      <Route path={adminRoutes.path} element={adminRoutes.element}>
        {adminRoutes.children.map((route, i) => (
          <Route key={i} index={route.index} path={route.path} element={route.element} />
        ))}
      </Route>
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
