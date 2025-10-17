import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PublicacionEditar = () => {
  
  // parametros
  const { id } = useParams();
  const idPublicacion = parseInt(id);
  const navigate = useNavigate();


  // lo primero que se ejecuta
  const headers = new Headers()
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${token}`);

  const [imagenes, setImagenes] = useState([
    {
      idImg: 0,
      img: ""
    }
  ]) 
  const [publicacion, setPublicacion] = useState(null)

  useEffect(() => {
    // obtener la informacion de la publicacion por idPublicacion
    const URL_GET_Publicacion = `http://localhost:4002/api/publicaciones/${idPublicacion}`
    fetch(URL_GET_Publicacion, {
      method: "GET",
      headers: headers
    })
      .then((response) => {
        if(!response.ok) throw new Error("No se encontro la publicacion.")
        return response.json()
      })
      .then((data) => setPublicacion(data) )
      .catch((error) => console.log("Error: ", error))

    // obtener las fotos por idPublicacion
    const URL_GET_Fotos = `http://localhost:4002/api/publicaciones/${idPublicacion}/fotos-contenido`
    fetch(URL_GET_Fotos)
      .then(response => {
          if (!response.ok) { 
              throw new Error('No se encontraron imágenes')
          }
          return response.json();
      })
      .then(data => {
          if (data && data.length > 0) {
            for(let i = 0; i < data.length; i++ ){
              setImagenes([
                ...imagenes,
                {
                  idImg: data[i].id,
                  img: `data:image/jpeg;base64,${data[i].file}`
                }
              ])
            }
          }
      })
      .catch(error => { 
          console.error('Error cargando imagen:', error);
      });


      

  }, [])


  // plantilla de los cambios
  const [cambios, setCambios] = useState({
    imgBorrar: [
      {
      idImg: 0,
      img: ""
    }
    ],
    imgAgregar: [],
    titulo: publicacion.titulo,
    precio: publicacion.precio,
    ubicacion: publicacion.ubicacion,
    descripcion: publicacion.descripcion,
    metodoDePago: publicacion.metodoDePago,
    estado: publicacion.estado
  });



  // variables
  const [imagenActual, setImagenActual] = useState(0);
  const [pubSeleccionadas, setPubSeleccionadas] = useState([
    {
      idImg: 0,
      img: ""
    }
  ]);
  const [principalId, setPrincipalId] = useState(publicacion.idFotoPrincipal)
  const cantidad = imagenes.length;

  const siguienteImagen = () => {
    if (imagenActual < cantidad - 1) setImagenActual(imagenActual + 1);
  };

  const anteriorImagen = () => {
    if (imagenActual > 0) setImagenActual(imagenActual - 1);
  };

  const irAImagen = (index) => setImagenActual(index);


  // handles

  const onFotoClick = (url) => {
    // 
    if (pubSeleccionadas.some((pub) => url.img === pub.img)) {
      setPubSeleccionadas(pubSeleccionadas.filter((pub) => pub.img !== url.img));
    } else {
      setPubSeleccionadas([...pubSeleccionadas, url]);
    }
  };

  const handleEliminarClick = () => {
    setCambios({ ...cambios, imgBorrar: pubSeleccionadas });
    const resto = imagenes.filter((img) => !pubSeleccionadas.some((pub) => pub.img === img.img));
    setImagenes(resto);
    setPubSeleccionadas([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCambios({ ...cambios, [name]: value });
  };

  const handleAñadirImagen = (e) => {
    const archivos = Array.from(e.target.files)
    const nuevasImagenes = archivos.map((file) => URL.createObjectURL(file));
    setImagenes((prev) => [...prev, ...nuevasImagenes]);
    setCambios({
      ...cambios,
      imgAgregar: [...cambios.imgAgregar, ...archivos]
    });
  };

  const handleEstadoChange = (value) => {
    let currentEstado = cambios.estado
    if(value === "Disponible") {
        currentEstado = "A"
      } if(value === "Vendido") {
        currentEstado = "V"
      } if(value === "Pausado") {
        currentEstado = "P"
      }
    setCambios({
      ...cambios,
      estado: currentEstado
    })
  }

  const handlePrincipalClick = () => {
    setPrincipalId(pubSeleccionadas[0])
  };

  const handleCancelarClick = () => {
    navigate(`/publicacion/${idPublicacion}`)
  }

  const handleEliminarPublicacion = () => {
    const URL_DELETE_Publicacion = `http://localhost:4002/api/publicaciones/${idPublicacion}`
    
    fetch(URL_DELETE_Publicacion, {
      method: "DELETE",
      headers: headers
    })
  }






  // confirmar cambios
  
  
  const handleCambioClick = () => {


    // eliminar fotos
    for(let i = 0; i < cambios.imgBorrar; i++) {
      let URL_DELETE_Foto = `http://localhost:4002/api/publicaciones/${idPublicacion}/fotos/${cambios.imgBorrar[i].idImg}`

      fetch(URL_DELETE_Foto, {
        method: "DELETE",
        headers: headers
      })
    }


    // posteo de fotos
    const URL_POST_Foto = `http://localhost:4002/api/publicaciones/${idPublicacion}/fotos`

    for(let i = 0; i < cambios.imgAgregar.length; i++) {
      let orden = i + imagenes.length
      const formData = new FormData()
      formData.append("file", cambios.imgAgregar[i])
      formData.append("esPrincipal", false)
      formData.append("orden", orden.toString())

      fetch(URL_POST_Foto, {
        method: "POST",
        headers: headers,
        body: formData
      })
    }


    // editar publicacion
    const URL_PUT_Publicacion = `http://localhost:4002/api/publicaciones/${idPublicacion}`

    fetch(URL_PUT_Publicacion, {
      method: "PUT",
      headers: headers,
      body: {
        titulo: cambios.titulo,
        descripcion: cambios.descripcion,
        ubicacion: cambios.ubicacion,
        precio: cambios.precio,
        metodoDePago: cambios.metodoDePago
      }
    })
    .then((response) => {
      if(!response.ok) throw new Error("Error al actualizar la publicacion.")
      return response.json()
    })
    .catch((error) => console.log("Error: ", error))


    // cambiar estado
    const URL_PUT_Estado = `http://localhost:4002/${idPublicacion}/estado`

    fetch(URL_PUT_Estado, {
      method: "PUT",
      headers: headers,
      body: cambios.estado
    })
    .then((response) => {
      if(!response.ok) throw new Error("El estado no se actualizo correctamente.")
      return response.json()
    })
    .catch((error) => console.log(error))


    // definir imagen como principal
    const URL_PUT_FotoPrincipal = `http://localhost:4002/api/publicaciones/${idPublicacion}/fotos/${principalId}/principal`

    fetch(URL_PUT_FotoPrincipal, {
      method: "PUT",
      headers: headers
    })
    .then((response) => {
      if(!response.ok) throw new Error("No se definio la imagen como principal.")
      return response.json()
    })
    .catch((error) => console.log("Error: ", error))
  }


  // chequeo (borrar)
  useEffect(() => {
    console.log("Cambios actuales:", cambios);
  }, [cambios]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F5EFE6] py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 space-y-8 border border-[#CBDCEB]">
        <h1 className="text-2xl font-semibold text-center text-gray-700">Editar Publicación</h1>

        {/* "Formulario" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Título</label>
            <input
              type="text"
              name="titulo"
              value={cambios.titulo}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Precio</label>
            <input
              type="text"
              name="precio"
              inputMode="numeric"
              pattern="[0-9]*"
              value={cambios.precio}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={cambios.ubicacion}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">Descripción</label>
            <textarea
              name="descripcion"
              value={cambios.descripcion}
              onChange={handleInputChange}
              rows="3"
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            />
          </div>

          {/* Selector de estado */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">Estado de la publicación</label>
            <select
              value={nuevoEstado}
              onChange={(e) => handleEstadoChange(e.target.value)}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] bg-[#F5EFE6] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            >
              <option value="Disponible">Disponible</option>
              <option value="Vendido">Vendido</option>
              <option value="Pausado">Pausado</option>
            </select>
          </div>
        </div>

        {/* Carrusel */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Imágenes</h2>

          <div className="max-w-xl mx-auto overflow-hidden relative rounded-2xl shadow-md">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${imagenActual * 100}%)` }}
            >
              {imagenes.map((url, index) => {
                const seleccionada = pubSeleccionadas.some((pub) => pub.img === url.img);
                return (
                  <div
                    key={index}
                    className="w-full h-64 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer relative"
                    onClick={() => onFotoClick(url)}
                  >
                    <img
                      src={url.img}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    {seleccionada && (
                      <div className="absolute top-3 right-3 bg-[#CBDCEB] rounded-full p-1 shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Botones de navegación */}
            {imagenActual > 0 && (
              <button
                onClick={anteriorImagen}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-[#CBDCEB] text-white p-2 rounded-full shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {imagenActual < cantidad - 1 && (
              <button
                onClick={siguienteImagen}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-[#CBDCEB] text-white p-2 rounded-full shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Botones acción */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleEliminarClick}
              className="bg-red-500 text-white font-medium px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Eliminar seleccionadas
            </button>

            <label className="bg-[#F5EFE6] border border-[#CBDCEB] text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-[#faf8f2] transition cursor-pointer">
              Añadir imagen
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAñadirImagen}
                className="hidden"
              />
            </label>

            {/* Boton seleccion imagen principal */}
            <button
              onClick={handlePrincipalClick}
              disabled={pubSeleccionadas.length !== 1}
              className={`font-medium px-4 py-2 rounded-md transition ${
                pubSeleccionadas.length === 1
                  ? "bg-[#CBDCEB] text-gray-700 hover:bg-[#b4cde2]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Seleccionar Principal
            </button>
          </div>
        </div>

        {/* Botones generales */}
        <div className="flex justify-center gap-4 mt-8">
          <button 
          onClick={handleCambioClick}
          className="bg-[#CBDCEB] text-gray-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-[#b4cde2] transition">
            Guardar Cambios
          </button>
          <button 
          onClick={handleCancelarClick}
          className="bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-400 transition">
            Cancelar
          </button>
        </div>

        {/* Boton eliminar publicacion */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleEliminarPublicacion}
            className="bg-red-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-red-600 transition"
          >
            Eliminar Publicación
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicacionEditar;
