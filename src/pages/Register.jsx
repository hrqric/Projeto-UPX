import React, { useState, useRef } from "react";

export default function Register({ onBack }) {
  // --- ESTADOS ---
  const [nome, setNome] = useState("");
  const [cameraAberta, setCameraAberta] = useState(false);
  const [fotoCapturada, setFotoCapturada] = useState(null); // Blob da imagem
  const [fotoPreview, setFotoPreview] = useState(null); // URL para mostrar na tela
  const [status, setStatus] = useState(""); // Mensagens de erro/sucesso
  const [loading, setLoading] = useState(false);

  // --- REFS ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // --- 1. CONTROLES DA CÂMERA ---
  const iniciarCamera = async () => {
    try {
      setFotoCapturada(null);
      setFotoPreview(null);
      setStatus("");
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setCameraAberta(true);
    } catch (err) {
      alert("Erro ao abrir câmera.");
    }
  };

  const tirarFoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      // Configura canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      
      // Desenha a foto
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Cria o Blob (arquivo) para enviar e o Preview para mostrar
      canvas.toBlob((blob) => {
        setFotoCapturada(blob);
        setFotoPreview(URL.createObjectURL(blob));
        pararCamera(); // Fecha a câmera e mostra só a foto estática
      }, "image/jpeg");
    }
  };

  const pararCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraAberta(false);
  };

  // --- 2. ENVIAR PARA O BACKEND ---
  const handleCadastro = async () => {
    if (!nome.trim()) {
      setStatus("⚠️ Digite o nome do aluno.");
      return;
    }
    if (!fotoCapturada) {
      setStatus("⚠️ Tire uma foto do aluno.");
      return;
    }

    setLoading(true);
    setStatus("Enviando...");

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("photo", fotoCapturada, "cadastro.jpg");

    try {
      // Envia para a rota /register do Python
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`✅ Sucesso! ${data.nome} cadastrado(a).`);
        // Limpa tudo para o próximo
        setNome("");
        setFotoCapturada(null);
        setFotoPreview(null);
      } else {
        setStatus(`❌ Erro: ${data.message}`);
      }
    } catch (error) {
      setStatus("❌ Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // --- EFEITO: Play no vídeo quando a câmera abre ---
  React.useEffect(() => {
    if (cameraAberta && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play();
    }
  }, [cameraAberta]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Novo Aluno</h2>
          <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 underline">
            Voltar
          </button>
        </div>

        {/* Input Nome */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: João Silva"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Área da Foto */}
        <div className="relative bg-black rounded-lg overflow-hidden h-64 mb-6 flex items-center justify-center">
          {cameraAberta ? (
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
          ) : fotoPreview ? (
            <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-500 text-center">
              <p>Câmera desligada</p>
            </div>
          )}
        </div>

        {/* Canvas Invisível */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Mensagens de Status */}
        {status && (
          <p className={`text-center mb-4 font-medium ${status.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {status}
          </p>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-col gap-3">
          {!cameraAberta && !fotoPreview && (
            <button onClick={iniciarCamera} className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              📸 Abrir Câmera
            </button>
          )}

          {cameraAberta && (
            <button onClick={tirarFoto} className="bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
              Capturar Foto
            </button>
          )}

          {fotoPreview && (
            <div className="flex gap-2">
               <button onClick={iniciarCamera} className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition">
                Tentar de novo
              </button>
              <button 
                onClick={handleCadastro} 
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-semibold text-white transition ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
              >
                {loading ? "Salvando..." : "Salvar Aluno"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}