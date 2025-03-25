'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type Publication = {
  _id: string
  title: string
  description: string
  author: string
  created_at: string
}

export default function PostDetails() {
  const router = useRouter()
  const params = useParams()
  const { token, isAuthenticated } = useAuth()
  const [post, setPost] = useState<Publication | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      if (!params) {
        toast.error('Erro ao carregar a publicação.')
        setIsLoading(false)
        return
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${params?.postId}`,
          {
            headers: {
              Authorization: `Bearer 06defc32-8a22-4152-8d15-834acf6456875`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Erro ao carregar a publicação.')
        }

        const postData = await response.json()
        setPost(postData)
      } catch (error) {
        toast.error('Erro ao carregar a publicação.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params?.postId])

  const handleDelete = async () => {
    if (!isAuthenticated || !token) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${params?.postId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        toast.success('Publicação excluída com sucesso!')
        router.push('/')
      } else {
        toast.error('Erro ao excluir a publicação.')
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor.')
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='p-8'>Carregando...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='p-8'>Publicação não encontrada</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      {/* Header */}
      <header className='bg-white shadow-md p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-gray-800'>Escola Desafio</h1>
          <Link
            href='/'
            className='flex items-center text-gray-600 hover:text-gray-800 transition duration-200'
          >
            <ArrowLeft className='w-5 h-5 mr-2' />
            Voltar
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className='flex-1 container mx-auto p-4'>
        <div className='bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-800 mb-4'>
            {post.title}
          </h1>
          <div className='text-gray-700 mb-6 whitespace-pre-line'>
            {post.description}
          </div>
          <div className='text-sm text-gray-500 mb-6'>
            <p>
              Publicado em:{' '}
              {new Date(post.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Botões de Ação */}
          {isAuthenticated && (
            <div className='flex space-x-4'>
              <Link
                href={`/posts/${post._id}/edit`}
                className='flex items-center px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-200'
              >
                <Edit className='w-5 h-5 mr-2' />
                Editar
              </Link>
              <button
                onClick={handleDelete}
                className='flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200'
              >
                <Trash className='w-5 h-5 mr-2' />
                Excluir
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-white shadow-md p-4 mt-8'>
        <div className='container mx-auto text-center text-gray-600'>
          <p>© 2023 Escola Desafio. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Notificações */}
      <ToastContainer position='bottom-center' autoClose={5000} />
    </div>
  )
}
