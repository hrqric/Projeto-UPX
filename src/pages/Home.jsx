import React, { useState } from "react";

export default function Home({ user }) {
  const [presencaMarcada, setPresencaMarcada] = useState(false);
  const [horario, setHorario] = useState("");

  // --- FUNÇÃO MODIFICADA ---
  const handlePresenca = async () => {
    try {
      // 1. Tenta acessar a câmera
      console.log("Solicitando acesso à câmera...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Acesso à câmera permitido.");
      
      // Para a trilha da câmera, já que só queríamos a permissão
      stream.getTracks().forEach(track => track.stop());

      // 2. Se deu certo, continua com a lógica original
      const now = new Date();
      const horarioFormatado = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setPresencaMarcada(true);
      setHorario(horarioFormatado);

      // Efeito de alerta animado
      const box = document.getElementById("feedback-box");
      if (box) {
        box.classList.add("animate-feedback");
        setTimeout(() => {
          box.classList.remove("animate-feedback");
        }, 1500);
      }

    } catch (err) {
      // 3. Se falhar, avisa o usuário
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        alert("Você precisa permitir o acesso à câmera para marcar presença!");
      } else {
        console.error("Erro ao acessar câmera:", err);
        alert("Não foi possível acessar a câmera.");
      }
    }
  };
  // --- FIM DA MODIFICAÇÃO ---

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-blue-100 p-10">
      {/* Logo no canto superior direito */}
      <div className="w-full flex justify-end mb-6">
        {/* <img ... /> (seu logo aqui se precisar) */}
      </div>

      {/* Card principal */}
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Olá, {user} 👋</h1>
        <p className="text-gray-600 mb-6">
          Clique no botão abaixo para registrar sua presença.
        </p>

        <button
          onClick={handlePresenca}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition transform hover:scale-105 mb-6"
        >
          Marcar Presença
        </button>

        {/* Feedback de presença */}
        {presencaMarcada && (
          <div
            id="feedback-box"
            className="bg-green-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition transform mb-4"
          >
            Presença registrada com sucesso às {horario}!
          </div>
        )}

        {/* Info adicional */}
        <p className="text-gray-500 text-sm">
          Lembre-se de marcar sua presença diariamente.
        </p>
      </div>

      {/* Animação simples */}
      <style>
        {`
          @keyframes feedbackAnim {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }

          .animate-feedback {
            animation: feedbackAnim 0.5s ease forwards;
          }
        `}
      </style>
    </div>
  );
}