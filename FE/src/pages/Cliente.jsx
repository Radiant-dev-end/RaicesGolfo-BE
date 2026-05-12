import React from 'react';
import ClientePag from '../components/CLIENTE/ClientePag';

// Pagina privada del cliente.
// Desde aqui se muestran reservas, hospedajes, perfil y otras acciones del usuario.
function Cliente() {
  return (
    <div className="cliente-page-wrapper">
      <ClientePag />
    </div>
  );
}

export default Cliente;
