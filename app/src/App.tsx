import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Catalog from './components/Catalog'
import CollectionsPage from './pages/CollectionsPage'
import ProductPage from './pages/ProductPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import AdminDashboard from './pages/AdminDashboard'
import ProductList from './pages/admin/ProductList'
import ProductEditor from './pages/admin/ProductEditor'
import ProductCreator from './pages/admin/ProductCreator'
import AttributeManager from './pages/admin/AttributeManager'
import CollectionManager from './pages/admin/CollectionManager'
import AccessoryManager from './pages/admin/AccessoryManager'
import SampleRequestsManager from './pages/admin/SampleRequestsManager'
import UserManager from './pages/admin/UserManager'
import Settings from './pages/admin/Settings'
import CatalogTools from './pages/admin/CatalogTools'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import About from './pages/About'
import Contact from './pages/Contact'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="product/:sku" element={<ProductPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="admin" element={
          <RoleRoute allowedRoles={['admin', 'ceo']}>
            <AdminDashboard />
          </RoleRoute>
        } />
        <Route path="admin/products" element={
          <RoleRoute allowedRoles={['admin', 'ceo', 'magazzino']}>
            <ProductList />
          </RoleRoute>
        } />
        <Route path="admin/products/new" element={
          <RoleRoute allowedRoles={['admin', 'ceo', 'acquisti']}>
            <ProductCreator />
          </RoleRoute>
        } />
        <Route path="admin/attributes" element={
          <RoleRoute allowedRoles={['admin', 'ceo']}>
            <AttributeManager />
          </RoleRoute>
        } />
        <Route path="admin/collections" element={
          <RoleRoute allowedRoles={['admin', 'ceo']}>
            <CollectionManager />
          </RoleRoute>
        } />
        <Route path="admin/accessories" element={
          <RoleRoute allowedRoles={['admin', 'ceo', 'acquisti']}>
            <AccessoryManager />
          </RoleRoute>
        } />
        <Route path="admin/samples" element={
          <RoleRoute allowedRoles={['admin', 'ceo', 'magazzino']}>
            <SampleRequestsManager />
          </RoleRoute>
        } />
        <Route path="admin/users" element={
          <RoleRoute allowedRoles={['admin', 'ceo']}>
            <UserManager />
          </RoleRoute>
        } />
        <Route path="admin/settings" element={
          <RoleRoute allowedRoles={['admin', 'ceo']}>
            <Settings />
          </RoleRoute>
        } />
        <Route path="admin/products/edit/:sku" element={
          <RoleRoute allowedRoles={['admin', 'ceo', 'acquisti']}>
            <ProductEditor />
          </RoleRoute>
        } />
        <Route path="admin/tools" element={
          <RoleRoute allowedRoles={['admin', 'ceo', 'acquisti']}>
            <CatalogTools />
          </RoleRoute>
        } />
        <Route path="cart" element={
          <ProtectedRoute>
             <Cart />
          </ProtectedRoute>
        } />
        <Route path="checkout" element={
          <ProtectedRoute>
             <Checkout />
          </ProtectedRoute>
        } />
        <Route path="payment/:orderId" element={
          <ProtectedRoute>
             <Payment />
          </ProtectedRoute>
        } />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
