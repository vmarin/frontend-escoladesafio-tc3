'use client'

import Link from 'next/link'
import { Edit, Trash } from 'lucide-react'

type PostContentProps = {
  post: {
    _id: string
    title: string
    description: string
    created_at: string
    updated_at?: string
    author?: string
  }
  isAuthenticated?: boolean
  onDelete?: () => void
  editHref?: string
}

export function PostContent({
  post,
  isAuthenticated = false,
  onDelete,
  editHref,
}: PostContentProps) {
  return (
    <div className='max-w-4xl mx-auto p-4 md:p-6 font-sans text-gray-800 space-y-6'>
      {/* Título com borda inferior */}
      <div className='pb-4 border-b border-gray-200'>
        <h1 className='text-2xl md:text-3xl font-bold'>{post.title}</h1>
      </div>

      {/* Container principal responsivo */}
      <div className='flex flex-col lg:flex-row gap-6 w-full'>
        {/* Conteúdo do post (2/3 em desktop, full em mobile) */}
        <div className='bg-white p-4 md:p-6 rounded-lg shadow-md w-full lg:w-2/3'>
          <div className='prose max-w-none'>
            <p className='whitespace-pre-line leading-relaxed'>
              {post.description}
            </p>
          </div>
        </div>

        {/* Metadados (1/3 em desktop, full em mobile) */}
        <div className='flex flex-col gap-4 w-full lg:w-1/3'>
          {/* Autor */}
          <div className='bg-white p-4 md:p-6 rounded-lg shadow-md space-y-3'>
            <h3 className='text-lg font-semibold'>Criado por</h3>
            <div className='mt-1 bg-gray-50 p-3 rounded'>
              <span className='text-gray-700'>
                {post.author || 'Autor desconhecido'}
              </span>
            </div>
          </div>

          {/* Datas */}
          <div className='bg-white p-4 md:p-6 rounded-lg shadow-md space-y-3'>
            <div className='space-y-3'>
              <h3 className='text-lg font-semibold'>Data de criação</h3>
              <div className='mt-1 bg-gray-50 p-3 rounded'>
                <p className='text-gray-700'>
                  {new Date(post.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {post.updated_at && (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold'>Data de modificação</h3>
                <div className='mt-1 bg-gray-50 p-3 rounded'>
                  <p className='text-gray-700'>
                    {new Date(post.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ações (se autenticado) */}
      {isAuthenticated && (
        <div className='flex flex-wrap gap-3'>
          {editHref && (
            <Link
              href={editHref}
              className='flex items-center px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700 transition-colors duration-300 text-sm md:text-base shadow-sm'
            >
              <Edit className='w-4 h-4 mr-2' />
              Editar
            </Link>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className='flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-300 text-sm md:text-base cursor-pointer shadow-sm'
            >
              <Trash className='w-4 h-4 mr-2' />
              Excluir
            </button>
          )}
        </div>
      )}
    </div>
  )
}
