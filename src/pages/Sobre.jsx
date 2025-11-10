import React from "react";

export default function Sobre() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-blue-50 p-10">
      <div className="max-w-3xl bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
          Sobre o Projeto
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed font-sans">
          Este projeto foi desenvolvido como parte de um trabalho da disciplina de 
          <span className="font-semibold"> UPX</span>. O objetivo é criar um sistema 
          de chamada automática onde os alunos podem registrar sua própria presença 
          de forma prática e rápida.  
          <br /><br />
          Utilizando este sistema, cada aluno consegue acessar sua conta, visualizar 
          suas presenças e faltas, e registrar sua chamada com segurança. Além disso, 
          a plataforma permite aos professores monitorarem facilmente a frequência 
          de cada aluno, tornando o processo mais eficiente e confiável.  
          <br /><br />
          O projeto visa unir tecnologia e educação, proporcionando uma experiência 
          moderna e intuitiva tanto para alunos quanto para professores.
        </p>
      </div>
    </div>
  );
}
