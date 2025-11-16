import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./chamada.css";

export default function Chamada({ user }) {
  const navigate = useNavigate();
  const [presencas, setPresencas] = useState({});
  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  useEffect(() => {
    const fetchPresencas = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/presencas?aluno=${user}`);
        const map = {};
        res.data.forEach((p) => {
          const dia = new Date(p.data).getDay();
          map[dia] = p.horario || "OK";
        });
        setPresencas(map);
      } catch (err) {
        console.error("Erro ao buscar presenças:", err);
      }
    };
    fetchPresencas();
  }, [user]);

  // --- FUNÇÃO MODIFICADA ---
  const handlePresenca = async () => {
    try {
      // 1. Tenta acessar a câmera primeiro
      console.log("Solicitando acesso à câmera...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Acesso à câmera permitido.");

      // 2. Para a trilha de vídeo (só queríamos a permissão)
      stream.getTracks().forEach(track => track.stop());

      // 3. Se a câmera foi acessada, continua com o registro
      const agora = new Date();
      const data = agora.toISOString().slice(0, 10);
      const horario = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

      await axios.post("http://localhost:5000/api/presenca", { aluno: user, data, horario });
      alert(`Presença confirmada às ${horario}`);
      setPresencas({ ...presencas, [agora.getDay()]: horario });

    } catch (err) {
      // Trata erros da câmera ou do axios
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        alert("Você precisa permitir o acesso à câmera para marcar presença!");
      } else if (err.response) {
        // Erro do axios
        console.error("Erro ao enviar presença:", err);
        alert("Erro ao registrar presença!");
      } else {
        // Outros erros (ex: câmera não encontrada)
        console.error("Erro:", err);
        alert("Não foi possível acessar a câmera ou registrar a presença.");
      }
    }
  };
  // --- FIM DA MODIFICAÇÃO ---

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  
  return (
    <div className="home-container">
      <header className="home-header">
        <h2>Olá, {user} 👋</h2>
        <img
          src="https://cidadao.facens.br/wp-content/uploads/2023/06/logo-f.webp" 
          alt="Facens Logo"
          className="facens-logo"
        />
      </header>

      <main className="home-content">
        <h3>Sua presença desta semana</h3>

        <div className="dias-grid">
          {diasSemana.map((dia, index) => (
            <div
              key={index}
              className={`dia-card ${presencas[index] ? "presente" : "ausente"}`}
            >
              <h4>{dia}</h4>
              <p>{presencas[index] ? `Presente às ${presencas[index]}` : "Faltou"}</p>
            </div>
          ))}
        </div>

        <div className="buttons">
          <button className="btn-presenca" onClick={handlePresenca}>
            Confirmar Presença de Hoje
          </button>
          <button className="btn-sair" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </main>
    </div>
  );
}