import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-400 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo da FACENS */}
        <div className="flex items-center gap-2">
          <img
            src="https://cidadao.facens.br/wp-content/uploads/2023/06/logo-f.webp"
            alt="FACENS Logo"
            className="h-10 w-auto"
          />
          <span className="font-bold text-xl"></span>
        </div>

        {/* Navegação */}
        <nav>
          <ul className="flex gap-6 font-semibold">
            <li>
              <Link
                to="/home"
                className="hover:text-gray-200 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/faltas"
                className="hover:text-gray-200 transition-colors"
              >
                Visualizar Faltas
              </Link>
            </li>
            <li>
              <Link
                to="/sobre"
                className="hover:text-gray-200 transition-colors"
              >
                Sobre Nós
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
