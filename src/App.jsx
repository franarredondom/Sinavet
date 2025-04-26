import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pacientes from "./pages/Pacientes";
import FichaPaciente from "./pages/FichaPaciente";
import ConsultaPaciente from "./pages/ConsultaPaciente";
import AgregarPaciente from "./pages/AgregarPaciente";
import Agenda from "./pages/Agenda";
import Disponibilidad from "./pages/Disponibilidad";
import Inventario from "./pages/Inventario";
import PortalFacturacion from "./pages/PortalFacturacion";
import EstadisticasClinicas from "./pages/EstadisticasClinicas";
import Laboratorio from "./pages/Laboratorio";
import SubirExamen from "./pages/SubirExamen";
import CrearExamen from "./pages/CrearExamen";
import ResultadoExamen from "./pages/ResultadoExamen";
import ResultadosLaboratorioTutor from "./components/ResultadosLaboratorioTutor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/:id" element={<FichaPaciente />} />
        <Route path="/agregar-paciente" element={<AgregarPaciente />} />
        <Route path="/consulta/:id" element={<ConsultaPaciente />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/disponibilidad" element={<Disponibilidad />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/facturacion" element={<PortalFacturacion />} />
        <Route path="/estadisticas" element={<EstadisticasClinicas />} />
        <Route path="/laboratorio" element={<Laboratorio />} />
        <Route path="/subir-examen" element={<SubirExamen />} />
        <Route path="/crear-examen" element={<CrearExamen />} />
        <Route path="/resultado-examen/:id" element={<ResultadoExamen />} />
        <Route path="/resultados-laboratorio" element={<ResultadosLaboratorioTutor rutTutor={localStorage.getItem('rut')} />} />

      </Routes>
    </Router>
  );
}

export default App;
