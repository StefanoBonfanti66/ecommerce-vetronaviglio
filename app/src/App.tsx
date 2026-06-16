import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Catalog from './components/Catalog'
import CollectionsPage from './pages/CollectionsPage'
import ProductPage from './pages/ProductPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="product/:sku" element={<ProductPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
