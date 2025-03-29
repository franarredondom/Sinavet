import { useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import HomeProfesional from "../components/HomeProfesional";
import HomeTutor from "../components/HomeTutor";

function Home() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      const rutID = localStorage.getItem("rut");

      if (!currentUser || !rutID) {
        navigate("/");
        return;
      }

      try {
        const docRef = doc(db, "usuarios", rutID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) return <div className="p-6">Cargando perfil...</div>;
  if (!userData) return <div className="p-6 text-red-600">No se pudo cargar el usuario.</div>;

  return userData.role === "profesional" ? (
    <HomeProfesional user={userData} />
  ) : (
    <HomeTutor user={userData} />
  );
}

export default Home;
