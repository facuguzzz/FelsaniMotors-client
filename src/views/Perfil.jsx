import { useState } from "react"
import { useNavigate } from "react-router-dom"
import UsuarioPublicaciones from "../components/usuario/UsuarioPublicaciones"
import UsuarioTransacciones from "../components/usuario/UsuarioTransacciones"
import UsuarioActualizacion from "../components/usuario/UsuarioActualizacion"
import UsuarioPerfil from "../components/usuario/UsuarioPerfil"
import CambioContrasena from "../components/usuario/CambioContrasena"

const Perfil = () => {
  const [perfilVisible, setPerfilVisible] = useState(true)
  const [publicacionesVisible, setPublicacionesVisible] = useState(false)
  const [transaccionesVisible, setTransaccionesVisible] = useState(false)
  const [modificarUsuarioVisible, setModificarUsuarioVisible] = useState(false)
  const [cambiarContrasenaVisible, setCambiarContrasenaVisible] = useState(false)

  const navigate = useNavigate()

  const handleClickPerfil = () => {
    setPerfilVisible(true)
    setPublicacionesVisible(false)
    setTransaccionesVisible(false)
  }
  const handleClickPublicaciones = () => {
    setPerfilVisible(false)
    setPublicacionesVisible(true)
    setTransaccionesVisible(false)
  }
  const handleClickTransacciones = () => {
    setPerfilVisible(false)
    setPublicacionesVisible(false)
    setTransaccionesVisible(true)
  }

  const changeActualizacionVisible = () => {
    setPerfilVisible(perfilVisible * -1)
    setModificarUsuarioVisible(modificarUsuarioVisible * -1)
  }
  const changeCambioContrasenaVisible = () => {
    setPerfilVisible(perfilVisible * -1)
    setCambiarContrasenaVisible(cambiarContrasenaVisible * -1)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md flex flex-col items-center py-6 space-y-4">
        <button
          onClick={() => navigate("/inicio")}
          className="text-sm text-gray-500 hover:text-blue-600"
        >
          ← Volver
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Panel de Usuario
        </h2>

        <button
          onClick={handleClickPerfil}
          className={`w-4/5 py-2 rounded-lg text-center ${
            perfilVisible
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Mi Perfil
        </button>

        <button
          onClick={handleClickPublicaciones}
          className={`w-4/5 py-2 rounded-lg text-center ${
            publicacionesVisible
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Publicaciones
        </button>

        <button
          onClick={handleClickTransacciones}
          className={`w-4/5 py-2 rounded-lg text-center ${
            transaccionesVisible
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Transacciones
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex justify-center items-start py-10 px-8">
        <div className="w-full max-w-4xl">
          {perfilVisible && (
            <UsuarioPerfil
              actualizacion={changeActualizacionVisible}
              constrasena={changeCambioContrasenaVisible}
            />
          )}
          {modificarUsuarioVisible && (
            <UsuarioActualizacion
              changeActualizacionVisible={changeActualizacionVisible}
            />
          )}
          {cambiarContrasenaVisible && (
            <CambioContrasena
              changeCambioContrasenaVisible={changeCambioContrasenaVisible}
            />
          )}
          {publicacionesVisible && <UsuarioPublicaciones />}
          {transaccionesVisible && <UsuarioTransacciones />}
        </div>
      </div>
    </div>
  )
}

export default Perfil
