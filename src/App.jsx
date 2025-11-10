import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Faltas from "./pages/Faltas";
import Sobre from "./pages/Sobre";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);

  // Carrega o usuário salvo no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(savedUser);
  }, []);

  // Salva user no localStorage sempre que mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", user);
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Página de login sem Header */}
        <Route path="/" element={<Login setUser={setUser} />} />

        {/* Páginas privadas com Header */}
        <Route
          path="/home"
          element={
            user ? (
              <>
                <Header />
                <Home user={user} />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/faltas"
          element={
            user ? (
              <>
                <Header />
                <Faltas user={user} />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/sobre"
          element={
            user ? (
              <>
                <Header />
                <Sobre />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Redirecionamento caso rota inválida */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
