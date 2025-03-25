'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PostContent } from '@/components/PostContent'
import { Header } from '@/components/Header'

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
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
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
      <Header showBackButton={true} backHref='/' />

      {/* Conteúdo Principal */}
      <main className='flex-1 container mx-auto p-4'>
        <PostContent
          post={post}
          isAuthenticated={isAuthenticated}
          onDelete={handleDelete}
          editHref={`/posts/${post._id}/edit`}
        />
      </main>

      {/* Notificações */}
      <ToastContainer position='bottom-center' autoClose={5000} />
    </div>
  )
}
