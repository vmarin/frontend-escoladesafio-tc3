"use client";

import { useEffect, useState, use } from "react"; // Adicione `use` aqui
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

type Publication = {
  _id: string;
  title: string;
  description: string;
  author: string;
  created_at: string;
};

export default function EditPost({ params }: { params: { postId: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Publication | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Desempacote `params` usando `React.use()`
  const { postId } = use(params);

  // Busca os detalhes da publicação
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, // Use `postId` desempacotado
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setPost(result);
          setTitle(result.title);
          setDescription(result.description);
        } else {
          toast.error("Erro ao carregar a publicação.");
        }
      } catch (error) {
        toast.error("Erro ao conectar com o servidor.");
      }
    };

    fetchPostDetails();
  }, [postId]); // Use `postId` como dependência

  // Função para salvar as alterações
  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, // Use `postId` desempacotado
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
          },
          body: JSON.stringify({ title, description }),
        }
      );

      if (response.ok) {
        toast.success("Publicação atualizada com sucesso!");
        router.push(`/posts/${postId}`); // Use `postId` desempacotado
      } else {
        toast.error("Erro ao atualizar a publicação.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    }
  };

  if (!post) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Editar Publicação
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              rows={4}
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-200"
          >
            Salvar
          </button>
          <Link
            href={`/posts/${post._id}`}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Cancelar
          </Link>
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={5000} />
    </div>
  );
}
