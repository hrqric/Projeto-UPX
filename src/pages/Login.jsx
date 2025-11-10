import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import "boxicons/css/boxicons.min.css";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "123") {
      localStorage.setItem("user", username);
      setUser(username);
      navigate("/home");
    } else {
      alert("Usuário ou senha incorretos!");
    }
  };

  return (
    <div className="login-page">
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>FACENS</h1>
          <p>Entre para marcar presença!</p>

          <div className="input-box">
            <input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Lembrar da senha
            </label>
            <a href="#">Esqueceu a senha?</a>
          </div>
          <button type="submit" className="btn">
            Entrar
          </button>

          <div className="register-link">
            <p>
              Não tem uma conta? <a href="#">Cadastre-se</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
