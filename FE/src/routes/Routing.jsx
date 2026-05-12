import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccessibilityWidget from '../components/ACCESSIBILITY/AccessibilityWidget';
import Chatbot from '../components/CHATBOT/Chatbot';
import AcercaDe from '../pages/AcercaDe';
import Admin from '../pages/Admin';
import Cliente from '../pages/Cliente';
import Gastronomia from '../pages/Gastronomia';
import Habitaciones from '../pages/Habitaciones';
import HistoriaIslasPage from '../pages/HistoriaIslasPage';
import Inicio from '../pages/Inicio';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import Tours from '../pages/Tours';
import Transporte from '../pages/Transporte';
import ProtectedRoute from './ProtectedRoute';

// Routing es el mapa principal de navegacion de toda la aplicacion.
// Aqui se decide que pagina mostrar segun la URL y que rutas requieren autenticacion.
function Routing() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Rutas publicas visibles para cualquier usuario. */}
        <Route path="/" element={<Inicio />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/habitaciones" element={<Habitaciones />} />
        <Route path="/gastronomia" element={<Gastronomia />} />
        <Route path="/transporte" element={<Transporte />} />
        <Route path="/acerca-de" element={<AcercaDe />} />
        <Route path="/historia-de-las-islas" element={<HistoriaIslasPage />} />
        <Route path="/isla-venado" element={<AcercaDe />} />

        {/* Rutas del flujo de autenticacion. */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reservar" element={<Login />} />

        {/* Rutas privadas separadas por rol. */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cliente"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <Cliente />
            </ProtectedRoute>
          }
        />

        {/* Si la ruta no existe, se redirige al inicio usando la vista principal. */}
        <Route path="*" element={<Inicio />} />
      </Routes>

      {/* Widgets globales siempre montados, sin importar la pagina actual. */}
      <Chatbot />
      <AccessibilityWidget />
    </BrowserRouter>
  );
}

export default Routing;
