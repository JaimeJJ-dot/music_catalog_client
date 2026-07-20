import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import ArtistsPage from './pages/ArtistsPage';
// import AlbumsPage from './pages/AlbumsPage'; // Lo habilitaremos en el siguiente módulo

// Componente Wrapper para blindar rutas privadas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas Privadas protegidas por OAuth 2.0 */}
        <Route
          path="/artists"
          element={
            <ProtectedRoute>
              <ArtistsPage />
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/artists" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
