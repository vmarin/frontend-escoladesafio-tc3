'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Header } from '@/components/Header'

type Publication = {
  _id: string
  title: string
  description: string
  author: string
  created_at: string
}

export default function EditPost() {
  const router = useRouter()
  const params = useParams()
  const { token, logout } = useAuth()
  const [post, setPost] = useState<Publication | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!params) {
        toast.error('Erro ao carregar a publicação.')
        router.push('/')
        return
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${params?.postId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
            },
          }
        )

        if (response.ok) {
          const result = await response.json()
          setPost(result)
          setTitle(result.title)
          setDescription(result.description)
        } else {
          toast.error('Erro ao carregar a publicação.')
          router.push('/')
        }
      } catch (error) {
        toast.error('Erro ao conectar com o servidor.')
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPostDetails()
  }, [params?.postId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description) {
      toast.error('Preencha todos os campos.')
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${params?.postId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        }
      )

      if (response.ok) {
        toast.success('Publicação atualizada com sucesso!')
        if (params) {
          router.push(`/posts/${params.postId}`)
        }
      } else if (response.status == 401) {
        toast.error('Token expirado.')
        setTimeout(() => {
          logout()
        }, 2000)
      } else {
        toast.error('Erro ao atualizar a publicação.')
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

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gray-100 flex flex-col'>
        {/* Header */}
        <Header
          showBackButton={true}
          backHref={params ? `/posts/${params.postId}` : '/'}
        />

        {/* Conteúdo Principal */}
        <main className='flex-1 container mx-auto p-4'>
          <div className='bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto'>
            <h1 className='text-3xl font-bold text-gray-800 mb-6'>
              Editar Publicação
            </h1>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Título
                </label>
                <input
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500'
                  rows={6}
                  required
                />
              </div>
              <div className='flex justify-end space-x-4'>
                <button
                  type='submit'
                  className='flex items-center px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-200'
                >
                  <Save className='w-5 h-5 mr-2' />
                  Salvar Alterações
                </button>
              </div>
            </form>
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
    </ProtectedRoute>
  )
}
