import { useEffect, useState, useContext } from "react";
import MetodoPagoForm from "./MetodoPagoForm";
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';

const TransaccionForm = ({idPublicacion}) => {

    const { user } = useContext(AuthContext);

    const [transaccionData, setTransaccionData] = useState({
        idPublicacion : "",
        idComprador : "",
        monto : "",
        metodoPago : "Visa",
        referenciaPago : "",
        comentarios : ""
    });
    const [publicacion, setPublicacion] = useState({
        titulo: "",
        descripcion: "",
        ubicacion: "",
        precio: 0,
        metodoDePago: "",
        fotoPrincipal: ""
    });

    const URLPublicacion = `http://localhost:4002/api/publicaciones/${idPublicacion}`;
    const URLTransaccion = `http://localhost:4002/api/transacciones`;

    useEffect(() => {
        const token = authService.getToken();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);

        fetch(URLPublicacion, {
            method: "GET",
            headers: headers
        })
        .then((response) => response.json())
        .then((data) => {
            setPublicacion(data);
        })
        .catch((error) => console.log('Error al buscar publicacion : ', error));
    }, [URLPublicacion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransaccionData({
            ...transaccionData,
            [name]: value
        });
    };

    const handleMetodoPagoChange = (metodoPagoData) => {
        setTransaccionData({
            ...transaccionData,
            metodoPago: metodoPagoData.metodoPago
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = authService.getToken();
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', `Bearer ${token}`);

            const transaccionFull = {
                ...transaccionData,
                idPublicacion : idPublicacion,
                idComprador : user?.id || "",
                monto : publicacion.precio,
                referenciaPago : generarReferenciaPago()
            };

            fetch(URLTransaccion, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(transaccionFull) 
            })
            .then((response) => {
                if(!response.ok) throw new Error("Error al crear la transaccion.");
                console.log("Transaccion creada:", response.json());
            });

            alert("¡Transacción exitosa!");
        } catch(error) {
            console.error("Error al crear la transaccion : ", error);
            alert("Hubo un error al procesar tu transacción. Intenta nuevamente.");
        }  
    };

    const generarReferenciaPago = () => {
        return Math.floor(Math.random() * 1000000).toString();
    };

    const formatearPrecio = (precio) => {
        return `$${parseFloat(precio).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="max-w-3xl mx-auto p-4 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Últimos pasos</h2>
                <p className="text-lg text-gray-600">Completa la información para finalizar tu compra</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen de compra</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-base text-gray-700">{publicacion.titulo || 'Cargando...'}</span>
                        <span className="text-lg font-semibold text-gray-900">{formatearPrecio(publicacion.precio)}</span>
                    </div>
                    <div className="border-t border-blue-300 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-800">Total</span>
                            <span className="text-3xl font-bold text-blue-600">{formatearPrecio(publicacion.precio)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <MetodoPagoForm onMetodoPagoChange={handleMetodoPagoChange} />

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                <label htmlFor="comentarios" className="block text-base font-semibold text-gray-700 mb-3">
                    Comentarios adicionales (opcional)
                </label>
                <textarea
                    id="comentarios"
                    name="comentarios"
                    value={transaccionData.comentarios}
                    onChange={handleChange}
                    placeholder="Agrega cualquier información adicional sobre tu compra..."
                    rows="4"
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none hover:border-blue-400 transition-colors"
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <button 
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                >
                    Finalizar Compra
                </button>
                <p className="text-sm text-gray-500 text-center mt-4">
                    Al finalizar, aceptas los términos y condiciones de la compra
                </p>
            </div>
        </div>
    )
}

export default TransaccionForm;