import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Autenticación
import Login from "./pages/autenticacion/Login";
import Register from "./pages/autenticacion/Register";

// Profesional
import Agenda from "./pages/Profesional/Agenda";
import AgregarPaciente from "./pages/profesional/AgregarPaciente";
import ConsultaPaciente from "./pages/Profesional/ConsultaPaciente";
import CrearExamen from "./pages/Profesional/CrearExamen";
import Disponibilidad from "./pages/Profesional/Disponibilidad";
import EstadisticasClinicas from "./pages/Profesional/EstadisticasClinicas";
import FichaPaciente from "./pages/Profesional/FichaPaciente";
import Inventario from "./pages/Profesional/Inventario";
import Pacientes from "./pages/Tutor/Pacientes";
import VerPacientes from "./pages/Profesional/VerPacientes";
import AgendaMedicaProfesional from "./pages/Profesional/AgendaMedicaProfesional";


// Laboratorio
import HomeLaboratorio from "./components/HomeLaboratorio";
import Laboratorio from "./pages/laboratorio/Laboratorio";
import ResultadoExamen from "./pages/laboratorio/ResultadoExamen";

// Tutor
import HomeTutor from "./components/HomeTutor";
import ResultadosLaboratorioTutor from "./pages/Tutor/ResultadosLaboratorioTutor";

// Recepción
import HomeRecepcion from "./components/HomeRecepcion";
import CitasDia from "./pages/recepcion/CitasDia";
import AgendarCitas from "./pages/recepcion/AgendarCitas";
import RegistrarUsuario from "./pages/recepcion/RegistrarUsuario";

// Otros
import PortalFacturacion from "./pages/PortalFacturacion";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>

        {/* Autenticación */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Profesional */}
        <Route path="/home" element={<Home />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/:id" element={<FichaPaciente />} />
        <Route path="/agregar-paciente" element={<AgregarPaciente />} />
        <Route path="/consulta/:id" element={<ConsultaPaciente />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/disponibilidad" element={<Disponibilidad />} />
        <Route path="/crear-examen" element={<CrearExamen />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/estadisticas" element={<EstadisticasClinicas />} />
        <Route path="/ver-pacientes" element={<VerPacientes />} />

        {/* Laboratorio */}
        <Route path="/home-laboratorio" element={<HomeLaboratorio />} />
        <Route path="/laboratorio" element={<Laboratorio />} />
        <Route path="/resultado-examen/:id" element={<ResultadoExamen />} />

        {/* Tutor */}
        <Route path="/home-tutor" element={<HomeTutor />} />
        <Route
          path="/resultados-laboratorio"
          element={<ResultadosLaboratorioTutor rutTutor={localStorage.getItem("rut")} />}
        />

        {/* Recepción */}
        <Route path="/home-recepcion" element={<HomeRecepcion />} />
        <Route path="/citas-dia" element={<CitasDia />} />
        <Route path="/agendar-cita" element={<AgendarCitas />} />
        <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
        <Route path="/agenda-medica" element={<AgendaMedicaProfesional />} />


        {/* Otros */}
        <Route path="/facturacion" element={<PortalFacturacion />} />
        <Route path="/inicio" element={<Home />} />

      </Routes>
    </Router>
  );
}

export default App;
