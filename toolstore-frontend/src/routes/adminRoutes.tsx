import { AdminLayout } from '../layouts/AdminLayout';
import { AdminRoute } from './AdminRoute';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminProductFormPage } from '../pages/admin/AdminProductFormPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from '../pages/admin/AdminOrderDetailPage';
import { AdminCustomersPage } from '../pages/admin/AdminCustomersPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminBrandsPage } from '../pages/admin/AdminBrandsPage';
import { AdminCouponsPage } from '../pages/admin/AdminCouponsPage';
import { AdminReviewsPage } from '../pages/admin/AdminReviewsPage';

export const adminRoutes = {
  path: '/admin',
  element: (
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  ),
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: 'products', element: <AdminProductsPage /> },
    { path: 'products/new', element: <AdminProductFormPage /> },
    { path: 'products/:id/edit', element: <AdminProductFormPage /> },
    { path: 'orders', element: <AdminOrdersPage /> },
    { path: 'orders/:id', element: <AdminOrderDetailPage /> },
    { path: 'customers', element: <AdminCustomersPage /> },
    { path: 'categories', element: <AdminCategoriesPage /> },
    { path: 'brands', element: <AdminBrandsPage /> },
    { path: 'coupons', element: <AdminCouponsPage /> },
    { path: 'reviews', element: <AdminReviewsPage /> },
  ],
};
