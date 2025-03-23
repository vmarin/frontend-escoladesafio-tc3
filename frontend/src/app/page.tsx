"use client";

import { useState, useEffect } from "react";
import { Search, Pencil, Trash, X, LogIn } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  type Publication = {
    title: string;
    description: string;
    author: string;
    created_at: string;
  };

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Publication | null>(null);
  const [data, setData] = useState<Publication[]>([]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts", {
          headers: {
            Authorization: "Bearer 06defc32-8a22-4152-8d15-834acf645687",
          },
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Error fetching data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPublications();
  }, []);

  const handleDelete = (item: Publication) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmDelete = () => {
    console.log(`Publicação "${selectedItem?.title}" excluída.`);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-background-900 p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Escola Desafio</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600">
            Nova publicação
          </button>
          <Link href="/login">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center w-full cursor-pointer">
              <LogIn className="w-5 h-5 mr-2" /> Login
            </button>
          </Link>
        </div>
      </header>

      <div className="bg-background-800 p-4 rounded-lg shadow">
        <div className="flex items-center border rounded-lg p-2 w-full max-w-md mb-4">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por [palavra-chave]"
            className="w-full outline-none pl-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-background-800">
              <th className="p-3 text-left">TÍTULO</th>
              <th className="p-3 text-left">DESCRIÇÃO</th>
              {/* <th className="p-3 text-left">AUTOR</th> */}
              <th className="p-3 text-left">DATA DE CRIAÇÃO</th>
              <th className="p-3 text-left">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((item, index) => {
                const formattedDate = new Date(
                  item.created_at
                ).toLocaleDateString("pt-BR");

                return (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="p-3">{item.title}</td>
                    <td className="p-3 truncate">
                      {item.description.length > 22
                        ? `${item.description.slice(0, 22)}...`
                        : item.description}
                    </td>
                    {/* <td className="p-3">{item.author}</td> */}
                    <td className="p-3">{formattedDate}</td>
                    <td className="p-3 flex space-x-2">
                      <button className="text-violet-500 hover:text-violet-600">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-background-900 bg-opacity-50">
          <div className="bg-background-800 p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Confirmação</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p>
              Tem certeza que deseja excluir a publicação &quot;
              <strong>{selectedItem?.title}</strong>&quot;?
            </p>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-background-800 rounded-lg hover:bg-background-900"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={confirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
