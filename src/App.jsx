import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Autenticación
import Login from "./pages/autenticacion/Login";
import Register from "./pages/autenticacion/Register";

// Profesional
import Agenda from "./pages/Profesional/Agenda";
import AgregarPaciente from "./pages/Profesional/AgregarPaciente";
import ConsultaPaciente from "./pages/Profesional/ConsultaPaciente";
import Disponibilidad from "./pages/Profesional/Disponibilidad";
import HistorialClinico from "./pages/Profesional/HistorialClinico";
import FichaPaciente from "./pages/Profesional/FichaPaciente";
import Inventario from "./pages/Profesional/Inventario";
import VerPacientes from "./pages/Profesional/VerPacientes";
import AgendaMedicaProfesional from "./pages/Profesional/AgendaMedicaProfesional";
import RevisarExamenes from "./pages/Profesional/RevisarExamenes";
import NotasProfesional from "./pages/Profesional/NotasProfesional";

// Laboratorio
import HomeLaboratorio from "./components/HomeLaboratorio";
import Laboratorio from "./pages/laboratorio/Laboratorio";
import ResultadoExamen from "./pages/laboratorio/ResultadoExamen";

// Tutor
import HomeTutor from "./components/HomeTutor";
import ResultadosLaboratorioTutor from "./pages/Tutor/ResultadosLaboratorioTutor";
import MisMascotas from "./pages/Tutor/MisMascotas";
import Historial from "./pages/Tutor/Historial";
import Contacto from "./pages/Tutor/Contacto";
import MensajesTutor from "./pages/recepcion/MensajesTutor";
import BoletasTutor from "./pages/Tutor/BoletasTutor";

// Recepción
import HomeRecepcion from "./components/HomeRecepcion";
import CitasDia from "./pages/recepcion/CitasDia";
import AgendarCitas from "./pages/recepcion/AgendarCitas";
import RegistrarUsuario from "./pages/recepcion/RegistrarUsuario";

// Otros
import PortalFacturacion from "./pages/PortalFacturacion";
import Home from "./pages/Home";
import CorregirCitasSinEstado from "./pages/CorregirCitasSinEstado";

function App() {
  return (
    <Router>
      <Routes>

        {/* Autenticación */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Profesional */}
        <Route path="/home" element={<Home />} />
        <Route path="/ver-pacientes" element={<VerPacientes />} />
        <Route path="/pacientes/:id" element={<FichaPaciente />} />
        <Route path="/agregar-paciente" element={<AgregarPaciente />} />
        <Route path="/consulta/:id" element={<ConsultaPaciente />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/disponibilidad" element={<Disponibilidad />} />
        <Route path="/revisar-examenes" element={<RevisarExamenes />} /> 
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/historial-clinico" element={<HistorialClinico />} />
        <Route path="/agenda-medica" element={<AgendaMedicaProfesional />} />
        <Route path="/notas" element={<NotasProfesional />} />


        {/* Laboratorio */}
        <Route path="/home-laboratorio" element={<HomeLaboratorio />} />
        <Route path="/laboratorio" element={<Laboratorio />} />
        <Route path="/resultado-examen/:id" element={<ResultadoExamen />} />

        {/* Tutor */}
        <Route path="/home-tutor" element={<HomeTutor />} />
        <Route path="/mis-mascotas" element={<MisMascotas />} />
        <Route path="/resultados-laboratorio" element={<ResultadosLaboratorioTutor rutTutor={localStorage.getItem("rut")} />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/mensajes-tutor" element={<MensajesTutor />} />
        <Route path="/boletas" element={<BoletasTutor />} />


        {/* Recepción */}
        <Route path="/home-recepcion" element={<HomeRecepcion />} />
        <Route path="/citas-dia" element={<CitasDia />} />
        <Route path="/agendar-cita" element={<AgendarCitas />} />
        <Route path="/registro-usuario" element={<RegistrarUsuario />} />

        {/* Otros */}
        <Route path="/facturacion" element={<PortalFacturacion />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/corregir" element={<CorregirCitasSinEstado />} />

      </Routes>
    </Router>
  );
}

export default App;
