import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";

const CambioContrasena = ({ changeCambioContrasenaVisible }) => {
  const { user } = useContext(AuthContext);
  const token = authService.getToken();

  const [contrasenaUpdate, setContrasenaUpdate] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
  });

  const URLContrasenaUpdate = `http://localhost:4002/api/usuarios/${user?.id}/cambiar-contrasena`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContrasenaUpdate({ ...contrasenaUpdate, [name]: value });
  };

  const handleCambio = (e) => {
    e.preventDefault();
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    fetch(URLContrasenaUpdate, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(contrasenaUpdate),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al actualizar contraseña.");
      })
      .catch((error) => console.error("Error: ", error));

    changeCambioContrasenaVisible();
  };

  return (
    <div className="bg-[#f5efe6] min-h-screen flex justify-center items-start py-10">
      <form
        onSubmit={handleCambio}
        className="bg-white border border-[#cbdceb] shadow-md rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Cambiar Contraseña
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">
              Escribe tu contraseña actual
            </label>
            <input
              name="contrasenaActual"
              type="password"
              placeholder="..."
              value={contrasenaUpdate.contrasenaActual}
              onChange={handleChange}
              className="w-full border border-[#cbdceb] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#cbdceb]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Escribe tu nueva contraseña
            </label>
            <input
              name="nuevaContrasena"
              type="password"
              placeholder="..."
              value={contrasenaUpdate.nuevaContrasena}
              onChange={handleChange}
              className="w-full border border-[#cbdceb] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#cbdceb]"
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={changeCambioContrasenaVisible}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Volver
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Cambiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CambioContrasena;
