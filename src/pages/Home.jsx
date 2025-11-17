import React, { useState, useRef, useEffect } from "react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

export default function Home({ user }) {
  // --- ESTADOS ---
  const [presencaMarcada, setPresencaMarcada] = useState(false);
  const [horario, setHorario] = useState("");
  const [cameraAberta, setCameraAberta] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState("Sistema pronto.");

  // --- REFS ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const faceDetectorRef = useRef(null);
  const animationIdRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  // --- 1. RESET AUTOMÁTICO (NOVO) ---
  useEffect(() => {
    let timer;
    if (presencaMarcada) {
      // Espera 3 segundos (3000ms) e reseta tudo para o próximo aluno
      timer = setTimeout(() => {
        setPresencaMarcada(false);
        setHorario("");
        setMensagemStatus("Sistema pronto.");
        // A câmera já foi parada no sucesso, então só resetamos a UI
      }, 3000); 
    }
    // Limpa o timer se o componente desmontar (evita erros)
    return () => clearTimeout(timer);
  }, [presencaMarcada]);


  // --- 2. CARREGAR MEDIAPIPE ---
  useEffect(() => {
    const carregarIA = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        faceDetectorRef.current = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          minDetectionConfidence: 0.5
        });
        console.log("MediaPipe carregado.");
      } catch (error) {
        console.error("Erro IA:", error);
        setMensagemStatus("Erro ao carregar IA.");
      }
    };
    carregarIA();
    
    return () => {
        if (faceDetectorRef.current) faceDetectorRef.current.close();
    };
  }, []);


  // --- 3. LOOP DE DETECÇÃO ---
  const renderLoop = () => {
    if (!cameraAberta || presencaMarcada) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const detector = faceDetectorRef.current;

    if (video && canvas && detector && !video.paused && !video.ended) {
      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        
        const startTime = performance.now();
        const detections = detector.detectForVideo(video, startTime).detections;

        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (detections.length > 0) {
          detections.forEach((detection) => {
            const { originX, originY, width, height } = detection.boundingBox;
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 4;
            ctx.strokeRect(originX, originY, width, height);
          });

          setMensagemStatus("Validando rosto...");

          // Envia para backend (com limitação de frequência simples)
          if (Math.random() < 0.05) { 
             enviarParaBackend(canvas);
          }
        } else {
          setMensagemStatus("Aproxime o rosto...");
        }
      }
    }
    animationIdRef.current = requestAnimationFrame(renderLoop);
  };


  // --- 4. ENVIAR PARA BACKEND ---
  const enviarParaBackend = (canvas) => {
    canvas.toBlob(async (blob) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append("photo", blob, "checkin.jpg");

        try {
            const response = await fetch("http://127.0.0.1:5000/checkin", {
                method: "POST",
                body: formData
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.status === "success") {
                    // SUCESSO!
                    pararCamera(); // Para a câmera imediatamente
                    const now = new Date();
                    setHorario(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
                    setPresencaMarcada(true); // Ativa a tela de sucesso
                    setMensagemStatus(`Bem-vindo(a), ${data.nome}!`);
                }
            }
        } catch (error) { /* ignora */ }
    }, "image/jpeg", 0.8);
  };


  // --- 5. CONTROLES ---
  const iniciarCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        setCameraAberta(true);
    } catch (err) {
        alert("Erro: Câmera não permitida.");
    }
  };

  const pararCamera = () => {
    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }
    setCameraAberta(false);
  };

  useEffect(() => {
    if (cameraAberta && videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play();
        videoRef.current.onloadeddata = () => {
            renderLoop();
        };
    }
  }, [cameraAberta]);


  // --- RENDERIZAÇÃO ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-10">
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center w-full max-w-lg text-center min-h-[400px]">
        
        {/* SÓ MOSTRA O CABEÇALHO SE NÃO TIVER MARCADO PRESENÇA */}
        {!presencaMarcada && (
          <h1 className="text-3xl font-bold text-blue-700 mb-8">
            Olá, {user || "Aluno"} 👋
          </h1>
        )}

        {/* ESTADO 1: CÂMERA ABERTA */}
        {cameraAberta && !presencaMarcada && (
          <div className="relative mb-6 w-full rounded-xl overflow-hidden shadow-lg border-4 border-blue-200 bg-black">
            <video ref={videoRef} className="hidden" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="w-full h-64 object-cover" />
            <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-white py-2 text-sm font-mono">
               {mensagemStatus}
            </div>
          </div>
        )}

        {/* ESTADO 2: BOTÃO INICIAL (Só aparece se câmera fechada e não marcou presença) */}
        {!presencaMarcada && !cameraAberta && (
          <button 
            onClick={iniciarCamera} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-l px-10 py-6 rounded-2xl shadow-lg transition transform hover:scale-105 w-full"
          >
            Marcar presença
          </button>
        )}

        {/* BOTÃO CANCELAR (Só se a câmera estiver aberta) */}
        {cameraAberta && !presencaMarcada && (
             <button onClick={pararCamera} className="mt-4 text-gray-500 hover:text-red-500 text-sm underline">
               Cancelar / Voltar
             </button>
        )}

        {/* ESTADO 3: SUCESSO (FICA SOZINHO NA TELA) */}
        {presencaMarcada && (
          <div className="flex flex-col items-center justify-center animate-fade-in">
            <div className="bg-green-500 text-white rounded-full p-4 mb-4 shadow-lg">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">Presença Confirmada!</h2>
            <p className="text-xl text-gray-700 mb-6">{mensagemStatus}</p>
            <p className="text-gray-400 text-sm">Próximo aluno em instantes...</p>
          </div>
        )}

      </div>
    </div>
  );
}