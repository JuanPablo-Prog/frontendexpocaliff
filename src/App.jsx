import { useState } from 'react';
import AppLayout from './components/Applayout';
import LoginPage from './pages/Loginpage';
import DashboardPage from "./pages/Dashboardpage";
import MateriasPage from "./pages/Materiaspage";
import CriteriosPage from "./pages/Criteriospage";
import GruposPage from "./pages/Grupospage";
import AlumnosPage from "./pages/Alumnospage";
import EquiposPage from "./pages/Equipospage";
import ExposicionesPage from "./pages/Exposicionespage";
import EvaluacionesPage from "./pages/Evaluacionespage";
import UsuariosPage from "./pages/Usuariospage";
import PerfilPage from "./pages/PerfilPage";
import ToastContainer from "./components/Toast";

import { getUsuario, clearSession } from './api/Client';
import { useToast } from './hooks/Usetoast';

export default function App() {
  const [usuario, setUsuario] = useState(getUsuario());
  const [page, setPage]       = useState('dashboard');
  const { toasts, toast, dismiss } = useToast();

  const handleLogout = () => { clearSession(); setUsuario(null); };

  if (!usuario) {
    return <LoginPage onLogin={(u) => setUsuario(u)} />;
  }

  const renderContent = () => {
    switch (page) {
      case "dashboard":    return <DashboardPage    toast={toast} />;
      case "usuarios":     return <UsuariosPage     toast={toast} />;
      case "materias":     return <MateriasPage     toast={toast} />;
      case "criterios":    return <CriteriosPage    toast={toast} />;
      case "grupos":       return <GruposPage       toast={toast} />;
      case "alumnos":      return <AlumnosPage      toast={toast} />;
      case "equipos":      return <EquiposPage      toast={toast} />;
      case "exposiciones":
        return (
          <ExposicionesPage
            toast={toast}
            onEvaluar={(exposicion) => {
              sessionStorage.setItem("evaluar_exposicion", JSON.stringify(exposicion));
              setPage("evaluaciones");
            }}
          />
        );
      case "evaluaciones": return <EvaluacionesPage toast={toast} />;
      case "perfil":       return <PerfilPage       toast={toast} />;
      default:             return <DashboardPage    toast={toast} />;
    }
  };

  return (
    <>
      <AppLayout page={page} setPage={setPage} usuario={usuario} onLogout={handleLogout}>
        {renderContent()}
      </AppLayout>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </>
  );
}