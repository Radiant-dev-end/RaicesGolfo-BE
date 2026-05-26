import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import AccessibilityWidget from '../components/ACCESSIBILITY/AccessibilityWidget';
import Chatbot from '../components/CHATBOT/Chatbot';
import ChatbotAdmin from '../components/CHATBOT/ChatbotAdmin';
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
import { LoadingProvider, useLoading } from '../context/LoadingContext';
import GlobalLoader from '../components/common/GlobalLoader/GlobalLoader';

// Componente que escucha el cambio de rutas para activar el loader de transición
function RouteTransitionListener() {
  const location = useLocation();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    // Al cambiar la URL, se activa un loader temporal por 700ms para una transición fluida y moderna
    startLoading('route-change');
    const timer = setTimeout(() => {
      stopLoading('route-change');
    }, 700);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}

// Routing es el mapa principal de navegacion de toda la aplicacion.
// Aqui se decide que pagina mostrar segun la URL y que rutas requieren autenticacion.
function Routing() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LoadingProvider>
        <RouteTransitionListener />
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
              <ProtectedRoute allowedRoles={[1]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <Cliente />
              </ProtectedRoute>
            }
          />

          {/* Si la ruta no existe, se redirige al inicio usando la vista principal. */}
          <Route path="*" element={<Inicio />} />
        </Routes>

        {/* Widgets globales siempre montados, sin importar la pagina actual. */}
        <ConditionalChatbot />
        <AccessibilityWidget />
        
        {/* Componente visual del loader global */}
        <GlobalLoader />
      </LoadingProvider>
    </BrowserRouter>
  );
}

// Renderiza dinámicamente el chatbot correcto según el módulo actual
function ConditionalChatbot() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return <ChatbotAdmin />;
  }
  return <Chatbot />;
}

export default Routing;
