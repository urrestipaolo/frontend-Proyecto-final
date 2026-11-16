import "./App.css";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./componentes/Layout";
import { PaginaProductos } from "./pages/PaginaProductos";
import { PaginaLogin } from "./pages/PaginaLogin";
import { RutaProtegida } from "./componentes/login/RutaProtegida";
import { PaginaVentas } from "./pages/PaginaVentas";
import { PaginaCajas } from "./pages/PaginaCajas";
import { PaginaCarritos } from "./pages/PaginaCarritos";
import { PaginaUsuarios } from "./pages/PaginasUsuarios";
import { PaginaPOS } from "./pages/PaginaPOS";
import { PaginaClienteCarrito } from "./pages/PaginaClienteCarrito";
import { PaginaClienteCatalogo } from "./pages/PaginaClienteCatalogo";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />

      <Route element={<MainLayout />}>
        
        <Route element={<RutaProtegida allowedRoles={[1, 2, 3]} />}>
          <Route path="/" element={
            <div className="p-8">
              <h1 className="text-2xl font-bold text-on-surface">Bienvenido al Dashboard</h1>
              <p className="text-on-surface-variant mt-2">Selecciona una opción en el menú lateral.</p>
            </div>
          } />
          <Route path="/productos" element={<PaginaProductos />} />
        </Route>


        <Route element={<RutaProtegida allowedRoles={[1, 2]} />}>
          <Route path="/ventas" element={<PaginaVentas />} />
          <Route path="/cajas" element={<PaginaCajas />} />
          <Route path="/pos" element={<PaginaPOS />} />
        </Route>

        <Route element={<RutaProtegida allowedRoles={[1]} />}>
          <Route path="/carrito" element={<PaginaCarritos />} />
          <Route path="/users" element={<PaginaUsuarios />} />
        </Route>

        <Route element={<RutaProtegida allowedRoles={[3]} />}>
          <Route path="/micarrito" element={<PaginaClienteCarrito />} />
          <Route path="/catalogo" element={<PaginaClienteCatalogo />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;