import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Catalog from './components/Catalog'
import CollectionsPage from './pages/CollectionsPage'
import ProductPage from './pages/ProductPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/AdminDashboard'
import ProductList from './pages/admin/ProductList'
import ProductEditor from './pages/admin/ProductEditor'
import CatalogTools from './pages/admin/CatalogTools'

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
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="admin/products" element={
          <AdminRoute>
            <ProductList />
          </AdminRoute>
        } />
        <Route path="admin/products/edit/:sku" element={
          <AdminRoute>
            <ProductEditor />
          </AdminRoute>
        } />
        <Route path="admin/tools" element={
          <AdminRoute>
            <CatalogTools />
          </AdminRoute>
        } />
        <Route path="cart" element={
          <ProtectedRoute>
             <div className="p-12">Carrello (Work in progress)</div>
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
