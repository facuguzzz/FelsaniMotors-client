import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import PublicacionCard from "../publicaciones/PublicacionCard";

const UsuarioPublicaciones = () => {
  const { user } = useContext(AuthContext);
  const token = authService.getToken();

  const [listVisible, setListVisible] = useState(true);
  const [cardVisible, setCardVisible] = useState(false);
  const [currentPublicacion, setCurrentPublicacion] = useState({
    titulo: "",
    descripcion: "",
    ubicacion: "",
    precio: "",
    metodoDePago: "",
  });
  const [publicaciones, setPublicaciones] = useState([]);

  const URLPublicaciones = `http://localhost:4002/api/publicaciones/usuario/${user?.id}`;

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    fetch(URLPublicaciones, { method: "GET", headers: headers })
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener publicaciones");
        return response.json();
      })
      .then((data) => setPublicaciones(data))
      .catch((error) => console.error("Error: ", error));
  }, [URLPublicaciones, token]);

  const handleClick = (publicacion) => {
    setCurrentPublicacion(publicacion);
    setListVisible(false);
    setCardVisible(true);
  };

  return (
    <div>
      {listVisible && (
        <div className="bg-[#f5efe6] min-h-screen py-10 px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicaciones.map((publicacion) => (
              <div
                key={publicacion.idPublicacion}
                className="bg-white border border-[#cbdceb] shadow-md rounded-2xl p-4 flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleClick(publicacion)}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {publicacion.titulo}
                </h3>
                <p className="text-[#6c94c4] font-medium mb-4">
                  ${publicacion.precio}
                </p>
                <p className="text-sm text-gray-600">
                  {publicacion.descripcion || "Sin descripción"}
                </p>
                <div className="mt-3 text-sm text-gray-400">
                  {publicacion.fechaPublicacion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {cardVisible && (
        <PublicacionCard
          key={currentPublicacion.idPublicacion}
          idPublicacion={currentPublicacion.idPublicacion}
          idUsuario={currentPublicacion.idUsuario}
          idAuto={currentPublicacion.idAuto}
          titulo={currentPublicacion.titulo}
          ubicacion={currentPublicacion.ubicacion}
          precio={currentPublicacion.precio}
          estado={currentPublicacion.estado}
          marcaAuto={currentPublicacion.marcaAuto}
          modeloAuto={currentPublicacion.modeloAuto}
        />
      )}
    </div>
  );
};

export default UsuarioPublicaciones;
