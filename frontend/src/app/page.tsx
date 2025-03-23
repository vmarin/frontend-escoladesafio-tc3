"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulação de autenticação
    if (username === "professor" && password === "professor123") {
      localStorage.setItem("userRole", "professor");
      toast.success("Login realizado com sucesso!");
      router.push("/posts");
    } else if (username === "aluno" && password === "aluno123") {
      localStorage.setItem("userRole", "aluno");
      toast.success("Login realizado com sucesso!");
      router.push("/posts");
    } else {
      toast.error("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition duration-200"
          >
            Entrar
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-center" autoClose={5000} />
    </div>
  );
}
