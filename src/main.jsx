import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home_PageMain from './user_pages/Home_PageMain.jsx'
import LoginPage from './user_pages/LoginPage.jsx'
import SignUpPage from './user_pages/SignUpPage.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js' 
import Avatar_Page from './user_pages/Avatar_Page.jsx'
import ShopPage from './user_pages/Shop_Page.jsx'
import CollectionsPage from './user_pages/Collection_Page.jsx'
import ProfilePage from './user_pages/Profile_Page.jsx'
import WishlistPage from './user_pages/Wishlist_Page.jsx'
import Orders_Page from './user_pages/Orders_Page.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import ProductPage from './user_pages/Product_Page.jsx'
import CartPage from './user_pages/Cart.jsx'
import AdminLogin from './admin_pages/Admin_Login.jsx'
import AdminHome from './admin_pages/Admin_HomePage.jsx'
import Dashboard from './admin_pages/Admin_Dashboard.jsx'
import AdminOrdersPanel from './admin_pages/Admin_Orders.jsx'
import AdminCustomersPanel from './admin_pages/Admin_CustomersPage.jsx'
import Landing_Page from './Landing_Page.jsx'
import RedirectHandler from './components/RedirectHandler.jsx'
import VendorHome from './vendor_panel/Vendor_HomePage.jsx'
import VendorDashboard from './vendor_panel/Vendor_Dashboard.jsx'
import VendorOrders from './vendor_panel/Vendor_OrdersPage.jsx'
import VendorProducts from './vendor_panel/Vendor_ProductList.jsx'
import VendorProductForm from './vendor_panel/Vendor_ProductForm.jsx'
import VendorSales from './vendor_panel/Vendor_SalesPage.jsx'
import AdminProductsPage from './admin_pages/Admin_ProductPage.jsx'
import EditProductForm from './vendor_panel/Vendor_EditProduct.jsx'
import CheckoutPage from './user_pages/CheckoutPage.jsx'
  
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccessPage from './user_pages/Order_Success'
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
    {
      path: '/',
      element: <Landing_Page/>
    },
    {
      path: '/user',
      element: <Home_PageMain/>
    },
    {
      path: '/login',
      element: <LoginPage/>
    },
    {
      path: '/signup',
      element: <SignUpPage/>
    },
    {
      path: '/avatar',
      element: <Avatar_Page/>
    },
    {
      path: '/profile',
      element: <ProfilePage/>
    },
    {
      path: '/shop',
      element: <ShopPage/>
    },
    {
      path: '/collections',
      element: <CollectionsPage/>
    },
    {
      path: '/wishlist',
      element: <WishlistPage/>
    },
    {
      path: '/cart',
      element: <CartPage/>
    },
    {
      path: '/product/:id',
      element: <ProductPage/>
    },
    {
      path: '/orders',
      element: <Orders_Page/>
    },
    {
      path: '/checkout',
      element: <CheckoutPage />
    },
    {
      path: '/checkout/success',
      element: <OrderSuccessPage />
    },
    {
      path: '/admin',
      element: <AdminHome />
    },
    {
      path: '/admin_dashboard',
      element: <Dashboard />
    },
    {
      path: '/admin_login',
      element: <AdminLogin />
    },
    {
      path: '/admin_products',
      element: <AdminProductsPage />
    },
    {
      path: '/admin_orders',
      element: <AdminOrdersPanel />
    },
    {
      path: '/admin_customers',
      element: <AdminCustomersPanel />
    },
    {
      path: '/vendor',
      element: <VendorHome />
    },
    {
      path: '/redirect',
      element: <RedirectHandler />
    },
    {
      path: '/vendor_dashboard',
      element: <VendorDashboard />
    },
    {
      path: '/vendor_orders',
      element: <VendorOrders />
    },
    {
      path: '/vendor_products',
      element: <VendorProducts />
    },
    {
      path: '/vendor_products/new',
      element: <VendorProductForm />
    },
    {
      path: 'vendor_products/edit/:id',
      element: <EditProductForm />
    },
    {
      path: 'vendor_sales',
      element: <VendorSales />
    },
  ]},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <Elements stripe={stripePromise}>
          <RouterProvider router={router} />
        </Elements>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
