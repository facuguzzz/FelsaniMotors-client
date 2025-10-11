import React from 'react'
import './App.css'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import PublicacionList from './components/publicaciones/PublicacionList'
import PublicacionForm from './components/publicaciones/PublicacionForm'
import TransaccionList from './components/transacciones/TransaccionList'
import TransaccionForm from './components/transacciones/TransaccionForm'
// import TailwindMockTest from './views/TailwindMockTest'

function App() {
  return (
    <>
      {/* Cambia entre ComponentsDemo y TailwindMockTest según necesites */}
      {/*<ComponentsDemo />*/}
      {/* <TailwindMockTest /> */}
      {/* <TransaccionList /> */}
      <TransaccionForm/>
      {/*       
      <Navbar />
      <PublicacionList />
      <PublicacionForm />
      <Footer /> */}

      

    </>
  )
}

export default App
