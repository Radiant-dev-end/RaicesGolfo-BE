import React from 'react'
import AdminPanel from '../components/ADMIN/PANEL/AdminPanel'

// Pagina contenedora del panel administrativo.
// La logica real del CRUD y de los modulos vive dentro de AdminPanel.
function Admin() {
  return (
    <div>
      <AdminPanel />
    </div>
  )
}
export default Admin;
