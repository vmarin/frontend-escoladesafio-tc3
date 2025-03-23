"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { Search, Edit, Trash, Plus, LogIn, ArrowLeft, X } from "lucide-react";

type Publication = {
  _id: string;
  title: string;
  description: string;
  author: string;
  created_at: string;
};

export default function PostsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Publication | null>(null);
  const [data, setData] = useState<Publication[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Verifica o papel do usuário ao carregar a página
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      router.push("/"); // Redireciona para o login se não estiver autenticado
    } else {
      setUserRole(role);
    }
  }, [router]);

  // Busca as publicações
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Erro ao buscar dados:", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchPublications();
  }, []);

  const handleDelete = (item: Publication) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem || !selectedItem._id) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${selectedItem._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
          },
        }
      );

      if (response.ok) {
        setData(data.filter((item) => item._id !== selectedItem._id));
        toast.success("Postagem excluída com sucesso!");
      } else {
        toast.error("Erro ao excluir a postagem.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setShowModal(false);
    }
  };

  if (!userRole) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Escola Desafio</h1>
          <div className="flex items-center space-x-4">
            {userRole === "professor" && (
              <Link
                href="/new-post"
                className="flex items-center px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Publicação
              </Link>
            )}
            <button
              onClick={() => {
                localStorage.removeItem("userRole");
                router.push("/");
              }}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 container mx-auto p-4">
        {/* Campo de Busca */}
        <div className="flex items-center border border-gray-300 rounded-lg p-2 w-full max-w-md mb-6 bg-white">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por título..."
            className="w-full outline-none pl-2 text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabela de Publicações */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left text-gray-700">TÍTULO</th>
                <th className="p-3 text-left text-gray-700">DESCRIÇÃO</th>
                <th className="p-3 text-left text-gray-700">DATA</th>
                {userRole === "professor" && (
                  <th className="p-3 text-left text-gray-700">AÇÕES</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data
                .filter((item) =>
                  item.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((item) => {
                  const formattedDate = new Date(
                    item.created_at
                  ).toLocaleDateString("pt-BR");

                  return (
                    <tr
                      key={item._id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition duration-200"
                    >
                      <td className="p-3 text-gray-800 hover:text-violet-600">
                        <Link
                          href={`/posts/${item._id}`}
                          className="hover:text-violet-600 transition duration-200"
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="p-3 text-gray-700 truncate max-w-xs">
                        {item.description}
                      </td>
                      <td className="p-3 text-gray-700">{formattedDate}</td>
                      {userRole === "professor" && (
                        <td className="p-3 flex space-x-2">
                          <Link
                            href={`/posts/${item._id}/edit`}
                            className="text-violet-500 hover:text-violet-600 transition duration-200"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-500 hover:text-red-700 transition duration-200"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md p-4 mt-8">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2023 Escola Desafio. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Modal de Confirmação de Exclusão */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Confirmação</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-700">
              Tem certeza que deseja excluir a publicação &quot;
              <strong>{selectedItem?.title}</strong>&quot;?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificações */}
      <ToastContainer position="bottom-center" autoClose={5000} />
    </div>
  );
}
