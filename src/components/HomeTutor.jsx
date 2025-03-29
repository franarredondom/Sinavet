function HomeTutor({ user }) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-pink-600 mb-2">Bienvenido/a, {user.fullName}</h1>
        <p className="mb-4 text-gray-700">Dirección: {user.address}</p>
  
        <h2 className="text-xl font-semibold mb-2">Tu panel:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li className="text-gray-500">Mis Mascotas (en desarrollo)</li>
          <li className="text-gray-500">Próximas Citas (en desarrollo)</li>
          <li className="text-gray-500">Pagos y Facturación (en desarrollo)</li>
        </ul>
      </div>
    );
  }
  
  export default HomeTutor;
  