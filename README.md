# 🐾 Sinavet - Sistema de Gestión Veterinaria

**Sinavet** es una plataforma web desarrollada para facilitar la gestión clínica, administrativa y de laboratorio en una clínica veterinaria. Está diseñada para ser utilizada por distintos roles como **tutores**, **profesionales veterinarios**, **laboratorio** y **recepción**.

---

## 🚀 Funcionalidades Principales

### 🧑‍⚕️ Profesional
- Gestión de agenda médica y pacientes
- Consulta médica con historial clínico
- Carga y revisión de exámenes
- Control de inventario y notas clínicas

### 🧪 Laboratorio
- Visualización de exámenes solicitados
- Registro y subida de resultados
- Estados de exámenes (pendiente/completado)

### 💁 Recepción
- Gestión de citas del día
- Registro de nuevos usuarios (Tutor, Profesional, Laboratorio)
- Agendamiento de citas
- Portal de pagos (simulación Transbank)

### 🧍 Tutor
- Registro y administración de mascotas
- Consulta de historial clínico
- Visualización y descarga de boletas
- Resultados de exámenes
- Contacto con la clínica

---

## 🛠️ Tecnologías Utilizadas

- **React** + **Vite** para el frontend
- **Ant Design** + **Tailwind CSS** para la interfaz
- **Firebase** (Firestore, Auth) como backend y base de datos
- **jsPDF** para generación de boletas PDF

---

## 🔐 Roles y Acceso

| Rol         | Funcionalidades Clave                               |
|-------------|-----------------------------------------------------|
| Tutor       | Ver historial, mascotas, exámenes, contacto         |
| Profesional | Fichas clínicas, inventario, consulta, notas        |
| Laboratorio | Subida y gestión de exámenes                        |
| Recepción   | Agenda diaria, usuarios, pagos                      |

---

## 📦 Instalación y Uso Local

```bash
# Clona el repositorio
git clone https://github.com/franarredondom/Sinavet.git
cd Sinavet

# Instala dependencias
npm install

# Ejecuta en modo desarrollo
npm run dev
