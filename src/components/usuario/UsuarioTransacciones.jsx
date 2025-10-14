import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import TransaccionCard from "../transacciones/TransaccionCard";

const UsuarioTransacciones = () => {
  const { user } = useContext(AuthContext);
  const token = authService.getToken();

  const [listVisible, setListVisible] = useState(true);
  const [cardVisible, setCardVisible] = useState(false);
  const [currentTransaccion, setCurrentTransaccion] = useState({});
  const [transaccciones, setTransacciones] = useState([]);

  const URLTransacciones = `http://localhost:4002/api/transacciones`;

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    fetch(URLTransacciones, { method: "GET", headers: headers })
      .then((response) => {
        if (!response.ok) throw new Error("Error al buscar transacciones");
        return response.json();
      })
      .then((data) => setTransacciones(data))
      .catch((error) => console.error("Error: ", error));
  }, [URLTransacciones, token]);

  const changeVisibles = () => {
    setListVisible(!listVisible);
    setCardVisible(!cardVisible);
  };

  const handleClick = (publicacion) => {
    setCurrentTransaccion(publicacion);
    changeVisibles();
  };

  return (
    <div className="bg-[#f5efe6] min-h-screen py-10 px-6">
      {listVisible &&
        transaccciones.map((publicacion) => (
          <div
            key={publicacion.idTransaccion}
            onClick={() => handleClick(publicacion)}
            className="bg-white border border-[#cbdceb] shadow-md rounded-2xl p-5 mb-4 cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="text-gray-800 font-semibold">
                  N° {publicacion.idTransaccion}
                </h4>
                <p className="text-sm text-gray-500">
                  {publicacion.fechaTransaccion}
                </p>
              </div>
              <h2 className="text-[#6c94c4] font-bold text-lg">
                ${publicacion.monto}
              </h2>
            </div>
            <div className="flex justify-end">
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  publicacion.estado === "COMPLETADA"
                    ? "bg-green-100 text-green-700"
                    : publicacion.estado === "PENDIENTE"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {publicacion.estado}
              </span>
            </div>
          </div>
        ))}
      {cardVisible && (
        <div className="max-w-3xl mx-auto bg-white border border-[#cbdceb] shadow-md rounded-2xl p-6">
          <TransaccionCard transaccion={currentTransaccion} />
        </div>
      )}
    </div>
  );
};

export default UsuarioTransacciones;
