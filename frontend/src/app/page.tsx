'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import { Search, Edit, Trash, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'

type Publication = {
  _id: string
  title: string
  description: string
  author: string
  created_at: string
}

export default function PostsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { token, logout } = useAuth()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Publication | null>(null)
  const [allPosts, setAllPosts] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Paginação
  const ITEMS_PER_PAGE = 5
  const currentPage = parseInt(searchParams?.get('page') || '1')
  const searchQuery = searchParams?.get('q') || ''

  // Atualiza o estado do input quando o query param muda
  useEffect(() => {
    setSearchInput(searchQuery)
    setSearch(searchQuery)
  }, [searchQuery])

  // Busca todas as publicações
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
            },
          }
        )
        if (response.ok) {
          const result = await response.json()
          // Ordena os posts por data de criação (mais novos primeiro)
          const sortedPosts = result.sort((a: Publication, b: Publication) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            )
          })
          setAllPosts(sortedPosts)
        } else {
          console.error('Erro ao buscar dados:', response.status)
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
        toast.error('Erro ao carregar publicações')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublications()
  }, [])

  // Debounce para busca automática
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        const params = new URLSearchParams(searchParams?.toString() || '')

        if (searchInput) {
          params.set('q', searchInput)
          params.set('page', '1') // Resetar para a primeira página ao buscar
        } else {
          params.delete('q')
        }

        router.push(`${pathname}?${params.toString()}`)
      }
    }, 500) // 500ms de delay

    return () => clearTimeout(timer)
  }, [searchInput, search, searchParams, pathname, router])

  // Filtra e ordena os posts com base na busca
  const filteredPosts = allPosts.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  // Paginação dos resultados filtrados
  const totalItems = filteredPosts.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  const handleDelete = (item: Publication) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedItem || !selectedItem._id) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${selectedItem._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        setAllPosts((prev) =>
          prev.filter((item) => item._id !== selectedItem._id)
        )
        toast.success('Postagem excluída com sucesso!')
      } else if (response.status == 401) {
        toast.error('Token expirado.')
        setTimeout(() => {
          logout()
        }, 2000)
      } else {
        toast.error('Erro ao excluir a postagem.')
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor.')
    } finally {
      setShowModal(false)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <div className='text-lg'>Carregando publicações...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <Header showNewPostButton={true} showAuthButton={true} />

      <main className='flex-1 container mx-auto p-4 md:p-6'>
        {/* Campo de Busca */}
        <div className='mb-6'>
          <div className='flex items-center border border-gray-300 rounded-lg p-2 w-full bg-white shadow-sm'>
            <Search className='w-5 h-5 text-gray-500 flex-shrink-0' />
            <input
              type='text'
              placeholder='Buscar por título...'
              className='w-full outline-none pl-2 text-gray-700'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        {/* Mensagem quando não há resultados */}
        {paginatedPosts.length === 0 && !isLoading && (
          <div className='text-center py-8 text-gray-500'>
            {filteredPosts.length === 0
              ? 'Nenhuma publicação encontrada'
              : 'Nenhuma publicação nesta página'}
          </div>
        )}

        {/* Tabela de Publicações - versão desktop */}
        <div className='hidden md:block space-y-4'>
          {paginatedPosts.map((item) => (
            <div
              key={item._id}
              className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 border border-gray-100'
            >
              <div className='grid grid-cols-12 gap-4 items-center'>
                <div className='col-span-5'>
                  <Link href={`/posts/${item._id}`}>
                    <h3 className='text-lg font-medium text-violet-600 hover:text-violet-700'>
                      {item.title}
                    </h3>
                  </Link>
                  <p className='text-gray-700 mt-1 line-clamp-2'>
                    {item.description}
                  </p>
                </div>
                <div className='col-span-3 text-gray-600'>
                  {item.author || 'Autor desconhecido'}
                </div>
                <div className='col-span-2 text-gray-600'>
                  {new Date(item.created_at).toLocaleDateString('pt-BR')}
                </div>
                {token && (
                  <div className='col-span-2 flex justify-end space-x-4'>
                    <Link
                      href={`/posts/${item._id}/edit`}
                      className='text-violet-500 hover:text-violet-600 transition duration-200'
                    >
                      <Edit className='w-5 h-5' />
                    </Link>
                    <button
                      onClick={() => handleDelete(item)}
                      className='text-red-500 hover:text-red-600 transition duration-200 cursor-pointer'
                    >
                      <Trash className='w-5 h-5' />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lista de Publicações - versão mobile */}
        <div className='md:hidden space-y-4'>
          {paginatedPosts.map((item) => (
            <div
              key={item._id}
              className='bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200 border border-gray-100'
            >
              <Link href={`/posts/${item._id}`}>
                <h3 className='text-lg font-medium text-violet-600 mb-1'>
                  {item.title}
                </h3>
              </Link>
              <p className='text-gray-700 text-sm mb-2 line-clamp-2'>
                {item.description}
              </p>
              <div className='flex justify-between items-center text-sm text-gray-500'>
                <span>
                  {new Date(item.created_at).toLocaleDateString('pt-BR')}
                </span>
                {token && (
                  <div className='flex space-x-3'>
                    <Link
                      href={`/posts/${item._id}/edit`}
                      className='text-violet-500 hover:text-violet-600'
                    >
                      <Edit className='w-4 h-4' />
                    </Link>
                    <button
                      onClick={() => handleDelete(item)}
                      className='text-red-500 hover:text-red-600'
                    >
                      <Trash className='w-4 h-4' />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Controles de Paginação */}
        {totalPages > 1 && (
          <div className='flex flex-col sm:flex-row justify-between items-center mt-8 gap-4'>
            <div className='flex-1'>
              {currentPage > 1 && (
                <Link
                  href={`/?page=${currentPage - 1}${
                    search ? `&q=${encodeURIComponent(search)}` : ''
                  }`}
                  className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 inline-block'
                >
                  Página Anterior
                </Link>
              )}
            </div>

            <span className='text-gray-600 text-sm sm:text-base'>
              Página {currentPage} de {totalPages}
            </span>

            <div className='flex-1 text-right'>
              {currentPage < totalPages && (
                <Link
                  href={`/?page=${currentPage + 1}${
                    search ? `&q=${encodeURIComponent(search)}` : ''
                  }`}
                  className='px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition duration-200 inline-block'
                >
                  Próxima Página
                </Link>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal de Confirmação de Exclusão */}
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-200'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-bold text-gray-800'>Confirmação</h2>
              <button
                onClick={() => setShowModal(false)}
                className='text-gray-500 hover:text-gray-700 transition duration-200'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <p className='text-gray-700'>
              Tem certeza que deseja excluir a publicação &quot;
              <strong>{selectedItem?.title}</strong>&quot;?
            </p>
            <div className='mt-4 flex justify-end space-x-2'>
              <button
                onClick={() => setShowModal(false)}
                className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200'
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200'
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position='bottom-center' autoClose={5000} />
    </div>
  )
}
