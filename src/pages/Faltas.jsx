import React, { useState, useEffect } from "react";

export default function Faltas({ user }) {
  const [presencas, setPresencas] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex"]; // remove sáb e dom

  useEffect(() => {
    const fakePresencas = {};
    const diasNoMes = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    for (let i = 1; i <= diasNoMes; i++) {
      const diaSemana = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i
      ).getDay();
      if (diaSemana !== 0 && diaSemana !== 6) { // ignora domingos(0) e sábados(6)
        fakePresencas[i] = Math.random() > 0.2 ? "Presente" : "Faltou"; // 80% chance de presença
      }
    }
    setPresencas(fakePresencas);
  }, [currentMonth]);

  const diasNoMes = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Faltas de {user}
      </h2>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {"<"} Mês Anterior
        </button>
        <span className="text-xl font-semibold text-gray-700">
          {currentMonth.toLocaleString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={handleNextMonth}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Próximo Mês {">"}
        </button>
      </div>

      {/* Cabeçalho apenas dias úteis */}
      <div className="grid grid-cols-5 text-center font-semibold text-gray-700 mb-1">
        {diasSemana.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Dias do mês apenas dias úteis */}
      <div className="grid grid-cols-5 text-center gap-1">
        {Array.from({ length: diasNoMes }, (_, i) => {
          const dia = i + 1;
          const diaSemana = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            dia
          ).getDay();
          if (diaSemana === 0 || diaSemana === 6) return null; // ignora sáb e dom

          const status = presencas[dia];
          return (
            <div
              key={dia}
              className={`p-4 rounded-lg border text-sm font-semibold
                ${
                  status === "Presente"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
            >
              <div>{dia}</div>
              <div className="text-xs">{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
