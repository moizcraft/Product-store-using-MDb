

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { RootLayout } from './layouts/RootLayout'
import { AuthLayout } from './layouts/AuthLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import ManageAdmins from './pages/ManageAdmins'
import SellerDashboard from './pages/SellerDashboard'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import SellerProducts from './pages/SellerProducts'
import AdminDashboard from './pages/AdminDashboard'
import AdminAddProduct from './pages/AdminAddProduct'
import AdminEditProduct from './pages/AdminEditProduct'
import AdminProducts from './pages/AdminProducts'
import SuperAdminDashboard from './pages/SuperAdminDashboardEnhanced'
import ManageUsers from './pages/ManageUsers'

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
        { path: "products", element: <Products /> },
        { path: "products/:id", element: <ProductDetail /> },
        { path: "cart", element: <Cart /> },
        { 
          path: "dashboard", 
          element: (
            <ProtectedRoute requiredRole={['admin', 'super-admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          ) 
        },
        { 
          path: "admin/products", 
          element: (
            <ProtectedRoute requiredRole={['admin', 'super-admin']}>
              <AdminProducts />
            </ProtectedRoute>
          ) 
        },
        { 
          path: "admin/add-product", 
          element: (
            <ProtectedRoute requiredRole={['admin', 'super-admin']}>
              <AdminAddProduct />
            </ProtectedRoute>
          ) 
        },
        { 
          path: "admin/edit-product/:id", 
          element: (
            <ProtectedRoute requiredRole={['admin', 'super-admin']}>
              <AdminEditProduct />
            </ProtectedRoute>
          ) 
        },
        { path: "orders", element: <Orders /> },
        { path: "profile", element: <Profile /> },
        { 
          path: "manage-admins", 
          element: (
            <ProtectedRoute requiredRole="super-admin">
              <ManageAdmins />
            </ProtectedRoute>
          )
        },
        { 
          path: "manage-users", 
          element: (
            <ProtectedRoute requiredRole="super-admin">
              <ManageUsers />
            </ProtectedRoute>
          )
        },
        { 
          path: "super-admin", 
          element: (
            <ProtectedRoute requiredRole="super-admin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          )
        }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
        { path: '/login', element: <Login /> },
        { path: '/signup', element: <Signup /> },
        { path: '/forgot-password', element: <ForgotPassword /> }
    ]
  },
  // Seller routes without RootLayout (no header/footer)
  { 
    path: "seller/dashboard", 
    element: (
      <ProtectedRoute requiredRole="seller">
        <SellerDashboard />
      </ProtectedRoute>
    )
  },
  { 
    path: "seller/products", 
    element: (
      <ProtectedRoute requiredRole="seller">
        <SellerProducts />
      </ProtectedRoute>
    )
  },
  { 
    path: "seller/add-product", 
    element: (
      <ProtectedRoute requiredRole="seller">
        <AddProduct />
      </ProtectedRoute>
    )
  },
  { 
    path: "seller/edit-product/:id", 
    element: (
      <ProtectedRoute requiredRole="seller">
        <EditProduct />
      </ProtectedRoute>
    )
  }
])


function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
